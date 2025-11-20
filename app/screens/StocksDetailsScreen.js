// screens/CryptoDetailsScreen.js
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import paperBullLogo from "../../assets/defaultImage.png";
import { SYMBOL_INFO } from '../../constants/symbols';
import { AuthContext } from '../../context/AuthContext';
import { CryptoContext } from '../../context/CryptoContext';
import axiosInstance from '../api/axiosInstance';
import OrderSuccessModal from '../components/OrderSuccessModal';
import TradingModal from "../components/TradingModel";


const { width } = Dimensions.get('window');

const getSymbolInfo = (symbol) => {
    const info = SYMBOL_INFO[symbol] || {
        name: symbol.replace('USDT', ''),
        color: '#2E5CFF',
        image: paperBullLogo
    };
    return info;
};

export default function CryptoDetailsScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { stock: initialStock } = route.params;
    const { user, token, apiKey, fetchUser } = useContext(AuthContext);
    const { marketData, getCryptoData, refreshing: contextRefreshing, refresh: contextRefresh } = useContext(CryptoContext);

    const [stock, setStock] = useState(initialStock);
    const [localRefreshing, setLocalRefreshing] = useState(false);
    const [isWatchlisted, setIsWatchlisted] = useState(false);
    const [watchlistLoading, setWatchlistLoading] = useState(false);
    const [watchlistItemId, setWatchlistItemId] = useState(null);
    const [selectedTimeframe, setSelectedTimeframe] = useState('24H');
    const [chartData, setChartData] = useState({ labels: [], data: [] });
    const [chartLoading, setChartLoading] = useState(true);
    const [showTradingModal, setShowTradingModal] = useState(false);
    const [tradeType, setTradeType] = useState('BUY');
    const [userBalance, setUserBalance] = useState(0);

    const [lastOrderType, setLastOrderType] = useState('BUY');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successOrderData, setSuccessOrderData] = useState(null);

    const symbolInfo = getSymbolInfo(stock.symbol);
    const isPositive = stock.change >= 0;

    // Update local stock data from context when marketData changes
    useEffect(() => {
        const contextStock = getCryptoData(stock.symbol);
        if (contextStock) {
            setStock(contextStock);
        }
    }, [marketData, stock.symbol]);

    // Check if item is in watchlist
    const checkWatchlistStatus = async () => {
        if (!user || !token) return;

        try {
            const response = await axiosInstance.get(
                `/user/watchlist/check/${stock.symbol}?assetType=CRYPTO`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'X-API-Key': apiKey || '',
                    },
                }
            );

            if (response.data.success) {
                setIsWatchlisted(response.data.isInWatchlist);
                if (response.data.watchlistItemId) {
                    setWatchlistItemId(response.data.watchlistItemId);
                }
            }
        } catch (error) {
            console.error('Error checking watchlist status:', error);
        }
    };

    // Toggle watchlist
    const toggleWatchlist = async () => {
        if (!user || !token) {
            Alert.alert('Not Logged In', 'Please login to use watchlist');
            return;
        }

        setWatchlistLoading(true);
        try {
            if (isWatchlisted && watchlistItemId) {
                // Remove from watchlist
                const response = await axiosInstance.delete(
                    `/user/watchlist/${watchlistItemId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'X-API-Key': apiKey || '',
                        },
                    }
                );

                if (response.data.success) {
                    setIsWatchlisted(false);
                    setWatchlistItemId(null);
                    Alert.alert('Success', 'Removed from watchlist');
                }
            } else {
                // Add to watchlist
                const response = await axiosInstance.post(
                    '/user/watchlist',
                    {
                        symbol: stock.symbol,
                        assetType: 'CRYPTO',
                        notes: `Added from ${symbolInfo.name} details`
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'X-API-Key': apiKey || '',
                        },
                    }
                );

                if (response.data.success) {
                    setIsWatchlisted(true);
                    setWatchlistItemId(response.data.data._id);
                    Alert.alert('Success', 'Added to watchlist');
                }
            }
        } catch (error) {
            console.error('Error toggling watchlist:', error);
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to update watchlist'
            );
        } finally {
            setWatchlistLoading(false);
        }
    };

    // Fetch user balance
    const fetchUserBalance = async () => {
        if (!user || !token) return;

        try {
            const response = await axiosInstance.get('/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-API-Key': apiKey || '',
                },
            });
            setUserBalance(response.data.user.virtualBalance || 0);
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    // Fetch chart data
    const fetchChartData = async (timeframe = selectedTimeframe) => {
        try {
            setChartLoading(true);
            const intervals = {
                '1H': { interval: '1m', limit: 60 },
                '24H': { interval: '15m', limit: 96 },
                '7D': { interval: '1h', limit: 168 },
                '1M': { interval: '4h', limit: 180 },
                '1Y': { interval: '1d', limit: 365 },
            };

            const { interval, limit } = intervals[timeframe];
            const response = await fetch(
                `https://api.binance.com/api/v3/klines?symbol=${stock.symbol}&interval=${interval}&limit=${limit}`
            );
            const data = await response.json();

            const prices = data.map((item) => parseFloat(item[4]));
            const labels = data.map((item, index) => {
                if (timeframe === '1H' && index % 10 === 0) {
                    return new Date(item[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                } else if (timeframe === '24H' && index % 12 === 0) {
                    return new Date(item[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                } else if (timeframe === '7D' && index % 24 === 0) {
                    return new Date(item[0]).toLocaleDateString([], { month: 'short', day: 'numeric' });
                } else if (timeframe === '1M' && index % 30 === 0) {
                    return new Date(item[0]).toLocaleDateString([], { month: 'short', day: 'numeric' });
                } else if (timeframe === '1Y' && index % 60 === 0) {
                    return new Date(item[0]).toLocaleDateString([], { month: 'short' });
                }
                return '';
            });

            setChartData({ labels, data: prices });
        } catch (error) {
            console.error('Error fetching chart data:', error);
        } finally {
            setChartLoading(false);
        }
    };

    // Refresh handler - combines context refresh with local data
    const onRefresh = async () => {
        setLocalRefreshing(true);
        await Promise.all([
            contextRefresh(), // Refresh market data from context
            fetchChartData(selectedTimeframe),
            fetchUserBalance(),
            checkWatchlistStatus()
        ]);
        setLocalRefreshing(false);
    };

    // Initial setup
    useEffect(() => {
        if (user && token) {
            fetchUserBalance();
            checkWatchlistStatus();
        }
        fetchChartData(selectedTimeframe);
    }, []);

    // Refetch chart when timeframe changes
    useEffect(() => {
        fetchChartData(selectedTimeframe);
    }, [selectedTimeframe]);

    const openTradingModal = (type) => {
        if (!user || !token) {
            Alert.alert('Not Logged In', 'Please login to trade');
            return;
        }
        setTradeType(type);
        setShowTradingModal(true);
    };

    const timeframes = ['1H', '24H', '7D', '1M', '1Y'];
    const refreshing = localRefreshing || contextRefreshing;

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={['#2E5CFF', '#1A3FCC']}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerTop}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Feather name="arrow-left" size={20} color="#FFFFFF" />
                    </TouchableOpacity>

                    <View style={styles.headerCenter}>
                        <Image
                            source={typeof symbolInfo.image === "string" ?
                                { uri: symbolInfo.image } : symbolInfo.image}
                            style={styles.headerImage}
                            resizeMode="contain"
                        />
                        <View>
                            <Text style={styles.headerTitle}>
                                {stock.symbol.replace('USDT', '')}
                            </Text>
                            <Text style={styles.headerSubtitle}>{symbolInfo.name}</Text>
                        </View>
                    </View>

                    <View style={styles.headerRight}>
                        <TouchableOpacity
                            style={styles.refreshButton}
                            onPress={onRefresh}
                            disabled={refreshing}
                        >
                            <Feather
                                name="refresh-cw"
                                size={18}
                                color="#FFFFFF"
                                style={refreshing ? { opacity: 0.5 } : {}}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.watchlistButton}
                            onPress={toggleWatchlist}
                            disabled={watchlistLoading}
                        >
                            {watchlistLoading ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <Feather
                                    name="star"
                                    size={18}
                                    color={isWatchlisted ? "#F59E0B" : "#FFFFFF"}
                                    fill={isWatchlisted ? "#F59E0B" : "transparent"}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Price Section */}
                <View style={styles.priceSection}>
                    <Text style={styles.currentPrice}>
                        ${stock.price >= 1 ? stock.price.toFixed(2) : stock.price.toFixed(6)}
                    </Text>
                    <View style={styles.changeContainer}>
                        <Feather
                            name={isPositive ? 'trending-up' : 'trending-down'}
                            size={16}
                            color={isPositive ? '#10B981' : '#EF4444'}
                        />
                        <Text style={[
                            styles.changeText,
                            isPositive ? styles.changePositive : styles.changeNegative
                        ]}>
                            {isPositive ? '+' : ''}{stock.change.toFixed(2)}%
                        </Text>
                        <Text style={styles.changeLabel}>Today</Text>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#2E5CFF"
                    />
                }
            >
                {/* Timeframe Selector */}
                <View style={styles.timeframeContainer}>
                    {timeframes.map((tf) => (
                        <TouchableOpacity
                            key={tf}
                            style={[
                                styles.timeframeButton,
                                selectedTimeframe === tf && styles.timeframeButtonActive
                            ]}
                            onPress={() => setSelectedTimeframe(tf)}
                        >
                            <Text style={[
                                styles.timeframeText,
                                selectedTimeframe === tf && styles.timeframeTextActive
                            ]}>
                                {tf}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Chart */}
                <View style={styles.chartContainer}>
                    {chartLoading ? (
                        <View style={styles.chartLoadingContainer}>
                            <ActivityIndicator size="large" color="#2E5CFF" />
                            <Text style={styles.chartLoadingText}>Loading chart...</Text>
                        </View>
                    ) : chartData.data.length > 0 ? (
                        <LineChart
                            data={{
                                labels: chartData.labels.filter(label => label !== ''),
                                datasets: [{ data: chartData.data }]
                            }}
                            width={width - 40}
                            height={200}
                            chartConfig={{
                                backgroundColor: '#FFFFFF',
                                backgroundGradientFrom: '#FFFFFF',
                                backgroundGradientTo: '#FFFFFF',
                                decimalPlaces: stock.price >= 1 ? 2 : 6,
                                color: (opacity = 1) => isPositive ? `rgba(16, 185, 129, ${opacity})` : `rgba(239, 68, 68, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                                propsForDots: { r: '0' },
                            }}
                            bezier
                            style={styles.chart}
                            withDots={false}
                        />
                    ) : (
                        <View style={styles.chartLoadingContainer}>
                            <Text style={styles.chartErrorText}>Unable to load chart</Text>
                        </View>
                    )}
                </View>

                {/* Stats Grid */}
                <View style={styles.statsSection}>
                    <Text style={styles.statsTitle}>Market Stats</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <View style={styles.statIconContainer}>
                                <Feather name="arrow-up" size={20} color="#10B981" />
                            </View>
                            <Text style={styles.statLabel}>24h High</Text>
                            <Text style={styles.statValue}>
                                ${stock.high >= 1 ? stock.high.toFixed(2) : stock.high.toFixed(6)}
                            </Text>
                        </View>

                        <View style={styles.statCard}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#FEE2E2' }]}>
                                <Feather name="arrow-down" size={20} color="#EF4444" />
                            </View>
                            <Text style={styles.statLabel}>24h Low</Text>
                            <Text style={styles.statValue}>
                                ${stock.low >= 1 ? stock.low.toFixed(2) : stock.low.toFixed(6)}
                            </Text>
                        </View>

                        <View style={styles.statCard}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#DBEAFE' }]}>
                                <Feather name="activity" size={20} color="#3B82F6" />
                            </View>
                            <Text style={styles.statLabel}>24h Volume</Text>
                            <Text style={styles.statValue}>
                                {(stock.volume / 1000000).toFixed(2)}M
                            </Text>
                        </View>

                        <View style={styles.statCard}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#FEF3C7' }]}>
                                <Feather name="dollar-sign" size={20} color="#F59E0B" />
                            </View>
                            <Text style={styles.statLabel}>Quote Volume</Text>
                            <Text style={styles.statValue}>
                                ${(stock.quoteVolume ? stock.quoteVolume / 1000000 : 0).toFixed(2)}M
                            </Text>
                        </View>

                        {stock.trades && (
                            <View style={styles.statCard}>
                                <View style={[styles.statIconContainer, { backgroundColor: '#F3E8FF' }]}>
                                    <Feather name="zap" size={20} color="#9333EA" />
                                </View>
                                <Text style={styles.statLabel}>24h Trades</Text>
                                <Text style={styles.statValue}>
                                    {(stock.trades / 1000).toFixed(1)}K
                                </Text>
                            </View>
                        )}

                        <View style={styles.statCard}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#E0F2FE' }]}>
                                <Feather name="trending-up" size={20} color="#0284C7" />
                            </View>
                            <Text style={styles.statLabel}>Open Price</Text>
                            <Text style={styles.statValue}>
                                ${stock.openPrice >= 1 ? stock.openPrice.toFixed(2) : stock.openPrice.toFixed(6)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.buyButtonMain}
                        onPress={() => openTradingModal('BUY')}
                    >
                        <LinearGradient
                            colors={['#10B981', '#059669']}
                            style={styles.buttonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Feather name="trending-up" size={20} color="#FFFFFF" />
                            <Text style={styles.buttonText}>Buy</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.sellButtonMain}
                        onPress={() => openTradingModal('SELL')}
                    >
                        <LinearGradient
                            colors={['#EF4444', '#DC2626']}
                            style={styles.buttonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Feather name="trending-down" size={20} color="#FFFFFF" />
                            <Text style={styles.buttonText}>Sell</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Trading Modal */}
            <TradingModal
                user={user}
                visible={showTradingModal}
                onClose={() => setShowTradingModal(false)}
                stock={stock}
                orderType={tradeType}
                userBalance={userBalance}
                onOrderSuccess={() => fetchUserBalance()}
                setSuccessOrderData={setSuccessOrderData}
                setShowSuccessModal={setShowSuccessModal}
                setLastOrderType={setLastOrderType}
                fetchUser={fetchUser}
                isWatchlisted={isWatchlisted}
                onToggleWatchlist={toggleWatchlist}
            />

            <OrderSuccessModal
                visible={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                orderData={successOrderData || {
                    symbol: 'BTC',
                    quantity: '0',
                    price: '0',
                    total: '0',
                }}
                orderType={lastOrderType}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 12,
    },
    headerImage: {
        width: 32,
        height: 32,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    headerSubtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    headerRight: {
        flexDirection: 'row',
        gap: 8,
    },
    refreshButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    watchlistButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    priceSection: {
        alignItems: 'center',
        marginTop: 8,
    },
    currentPrice: {
        fontSize: 36,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    changeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    changeText: {
        fontSize: 16,
        fontWeight: '600',
    },
    changePositive: {
        color: '#10B981',
    },
    changeNegative: {
        color: '#EF4444',
    },
    changeLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginLeft: 4,
    },
    content: {
        flex: 1,
    },
    timeframeContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 8,
    },
    timeframeButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
    },
    timeframeButtonActive: {
        backgroundColor: '#2E5CFF',
        borderColor: '#2E5CFF',
    },
    timeframeText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    timeframeTextActive: {
        color: '#FFFFFF',
    },
    chartContainer: {
        paddingHorizontal: 20,
        marginTop: 8,
        height: 220,
    },
    chartLoadingContainer: {
        height: 200,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    chartLoadingText: {
        fontSize: 14,
        color: '#6B7280',
    },
    chartErrorText: {
        fontSize: 14,
        color: '#EF4444',
    },
    chart: {
        borderRadius: 16,
    },
    statsSection: {
        paddingHorizontal: 20,
        marginTop: 24,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    statCard: {
        width: (width - 52) / 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#DCFCE7',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 30,
        paddingHorizontal: 20,
        gap: 12,
    },
    buyButtonMain: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    sellButtonMain: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    buttonGradient: {
        height: 50,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});