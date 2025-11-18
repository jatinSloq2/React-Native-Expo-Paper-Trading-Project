import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

// Enhanced function to get crypto logo - works for almost all cryptos
const getCryptoLogoUrl = (symbol) => {
    const baseAsset = symbol.replace('USDT', '').toLowerCase();

    // Common aliases mapping
    const aliases = {
        'bnb': 'binance-coin',
        'matic': 'polygon',
        'shib': 'shiba-inu',
        'uni': 'uniswap',
        'link': 'chainlink',
        'avax': 'avalanche',
        'atom': 'cosmos',
        'hbar': 'hedera',
        'vet': 'vechain',
        'fil': 'filecoin',
        'etc': 'ethereum-classic',
        'xlm': 'stellar',
        'trx': 'tron',
        'xtz': 'tezos',
        'algo': 'algorand',
        'near': 'near-protocol',
        'ftm': 'fantom',
        'apt': 'aptos',
        'arb': 'arbitrum',
        'op': 'optimism',
        'grt': 'the-graph',
        'sand': 'the-sandbox',
        'mana': 'decentraland',
        'chz': 'chiliz',
        'ape': 'apecoin',
        'ldo': 'lido-dao',
        'imx': 'immutable-x',
        'inj': 'injective',
        'rune': 'thorchain',
        'cro': 'crypto-com-coin',
        'qnt': 'quant',
        'kcs': 'kucoin-token',
        'cake': 'pancakeswap',
        'mkr': 'maker',
        'gala': 'gala',
        'axs': 'axie-infinity',
        'flow': 'flow',
        'xmr': 'monero',
        'eos': 'eos',
        'bsv': 'bitcoin-sv',
        'neo': 'neo',
        'klay': 'klaytn',
        'iota': 'iota',
        'hnt': 'helium',
        'theta': 'theta',
        'zec': 'zcash',
        'dash': 'dash',
        'bat': 'basic-attention-token',
        'enj': 'enjin-coin',
        '1inch': '1inch',
        'comp': 'compound',
        'snx': 'synthetix',
        'crv': 'curve-dao-token',
        'sushi': 'sushiswap',
        'yfi': 'yearn-finance',
        'uma': 'uma',
        'bal': 'balancer',
        'zrx': '0x',
        'knc': 'kyber-network',
        'lrc': 'loopring',
        'ont': 'ontology',
        'icx': 'icon',
        'zil': 'zilliqa',
        'waves': 'waves',
        'rvn': 'ravencoin',
        'sc': 'siacoin',
        'stx': 'stacks',
        'mina': 'mina-protocol',
        'rose': 'oasis-network',
        'one': 'harmony',
        'celo': 'celo',
        'mask': 'mask-network',
        'blur': 'blur',
        'pepe': 'pepe',
        'floki': 'floki',
        'dydx': 'dydx',
        'gmx': 'gmx',
        'pendle': 'pendle',
        'sei': 'sei',
        'tia': 'celestia',
        'wld': 'worldcoin',
        'fet': 'fetch-ai',
        'rndr': 'render-token',
        'jup': 'jupiter',
        'pyth': 'pyth-network',
        'jto': 'jito',
        'bonk': 'bonk',
        'wif': 'dogwifhat',
    };

    const logoName = aliases[baseAsset] || baseAsset;

    return `https://cryptologos.cc/logos/${logoName}-${baseAsset}-logo.png`;
};

// Get symbol info with dynamic fallback
const getSymbolInfo = (symbol) => {
    const baseAsset = symbol.replace('USDT', '');
    const colors = {
        'BTC': '#F7931A',
        'ETH': '#627EEA',
        'BNB': '#F3BA2F',
        'SOL': '#14F195',
        'XRP': '#23292F',
        'ADA': '#0033AD',
        'DOGE': '#C2A633',
        'MATIC': '#8247E5',
        'DOT': '#E6007A',
        'LTC': '#345D9D',
        'AVAX': '#E84142',
        'LINK': '#2A5ADA',
        'UNI': '#FF007A',
        'ATOM': '#2E3148',
    };

    return {
        name: baseAsset,
        color: colors[baseAsset] || '#2E5CFF',
        image: getCryptoLogoUrl(symbol)
    };
};

export default function CryptoDetailsScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { stock: initialStock } = route.params;

    const [stock, setStock] = useState(initialStock);
    const [refreshing, setRefreshing] = useState(false);
    const [priceUpdating, setPriceUpdating] = useState(false);
    const [isWatchlisted, setIsWatchlisted] = useState(false);
    const [selectedTimeframe, setSelectedTimeframe] = useState('24H');
    const [chartData, setChartData] = useState({ labels: [], data: [] });
    const [chartLoading, setChartLoading] = useState(true);
    const updateIntervalRef = useRef(null);

    const symbolInfo = getSymbolInfo(stock.symbol);
    const isPositive = stock.change >= 0;
    const changeValue = !isNaN(stock.change) ? stock.change : 0;
    const priceValue = !isNaN(stock.price) ? stock.price : 0;

    // Fetch chart data based on timeframe
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

            // Format data for react-native-chart-kit
            const prices = data.map((item) => parseFloat(item[4])); // Close prices
            const labels = data.map((item, index) => {
                // Show only a few labels to avoid crowding
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
            setChartData({ labels: [], data: [] });
        } finally {
            setChartLoading(false);
        }
    };

    // Update stock data (called every 4 seconds)
    const updateStockData = async (showUpdatingIndicator = true) => {
        try {
            if (showUpdatingIndicator) {
                setPriceUpdating(true);
            }

            const response = await fetch(
                `https://api.binance.com/api/v3/ticker/24hr?symbol=${stock.symbol}`
            );
            const data = await response.json();

            setStock({
                symbol: data.symbol,
                price: parseFloat(data.lastPrice) || 0,
                change: parseFloat(data.priceChangePercent) || 0,
                high: parseFloat(data.highPrice) || 0,
                low: parseFloat(data.lowPrice) || 0,
                volume: parseFloat(data.volume) || 0,
                openPrice: parseFloat(data.openPrice) || 0,
                quoteVolume: parseFloat(data.quoteVolume) || 0,
                trades: data.count || 0,
            });

            if (showUpdatingIndicator) {
                setTimeout(() => setPriceUpdating(false), 500);
            }
        } catch (error) {
            console.error('Error updating stock:', error);
            setPriceUpdating(false);
        }
    };

    // Pull to refresh handler
    const onRefresh = async () => {
        setRefreshing(true);
        await Promise.all([
            updateStockData(false),
            fetchChartData(selectedTimeframe)
        ]);
        setRefreshing(false);
    };

    // Initial load and interval setup
    useEffect(() => {
        updateStockData(false);
        fetchChartData(selectedTimeframe);

        updateIntervalRef.current = setInterval(() => {
            updateStockData(true);
        }, 4000);

        return () => {
            if (updateIntervalRef.current) {
                clearInterval(updateIntervalRef.current);
            }
        };
    }, [stock.symbol]);

    // Update chart when timeframe changes
    useEffect(() => {
        fetchChartData(selectedTimeframe);
    }, [selectedTimeframe]);

    const toggleWatchlist = () => {
        setIsWatchlisted(!isWatchlisted);
    };

    const timeframes = ['1H', '24H', '7D', '1M', '1Y'];

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
                            source={{ uri: symbolInfo.image }}
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
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.watchlistButton}
                            onPress={toggleWatchlist}
                        >
                            <Feather
                                name="star"
                                size={18}
                                color={isWatchlisted ? "#F59E0B" : "#FFFFFF"}
                                fill={isWatchlisted ? "#F59E0B" : "transparent"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Price Section */}
                <View style={styles.priceSection}>
                    <View style={styles.priceRow}>
                        <Text style={styles.currentPrice}>
                            ${priceValue >= 1 ? priceValue.toFixed(2) : priceValue.toFixed(6)}
                        </Text>
                        {/* {priceUpdating && (
                            <View style={styles.updatingIndicator}>
                                <View style={styles.pulseDot} />
                            </View>
                        )} */}
                    </View>
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
                            {isPositive ? '+' : ''}{changeValue.toFixed(2)}%
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
                        colors={['#2E5CFF']}
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
                        <View style={styles.chartWrapper}>
                            <LineChart
                                data={{
                                    labels: chartData.labels.filter(label => label !== ''),
                                    datasets: [{
                                        data: chartData.data
                                    }]
                                }}
                                width={width - 60}
                                height={200}
                                chartConfig={{
                                    backgroundColor: '#FFFFFF',
                                    backgroundGradientFrom: '#FFFFFF',
                                    backgroundGradientTo: '#FFFFFF',
                                    decimalPlaces: priceValue >= 1 ? 2 : 6,
                                    color: (opacity = 1) => isPositive ? `rgba(16, 185, 129, ${opacity})` : `rgba(239, 68, 68, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                                    style: {
                                        borderRadius: 16,
                                    },
                                    propsForDots: {
                                        r: '0',
                                    },
                                    propsForBackgroundLines: {
                                        strokeDasharray: '',
                                        stroke: '#E5E7EB',
                                        strokeWidth: 1,
                                    },
                                }}
                                bezier
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 16,
                                }}
                                withInnerLines={true}
                                withOuterLines={false}
                                withVerticalLabels={true}
                                withHorizontalLabels={true}
                                withDots={false}
                                withShadow={false}
                                fromZero={false}
                            />
                        </View>
                    ) : (
                        <View style={styles.chartLoadingContainer}>
                            <Feather name="trending-up" size={48} color="#9CA3AF" />
                            <Text style={styles.chartPlaceholderText}>No chart data available</Text>
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
                    </View>
                </View>

                {/* Additional Info */}
                <View style={styles.infoSection}>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Open Price</Text>
                            <Text style={styles.infoValue}>
                                ${stock.openPrice >= 1 ? stock.openPrice.toFixed(2) : stock.openPrice.toFixed(6)}
                            </Text>
                        </View>
                        <View style={styles.infoDivider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Number of Trades</Text>
                            <Text style={styles.infoValue}>
                                {stock.trades ? stock.trades.toLocaleString() : 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.infoDivider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Market</Text>
                            <Text style={styles.infoValue}>Binance</Text>
                        </View>
                    </View>
                </View>

                {/* About Section */}
                <View style={styles.aboutSection}>
                    <Text style={styles.aboutTitle}>About {symbolInfo.name}</Text>
                    <View style={styles.aboutCard}>
                        <Text style={styles.aboutText}>
                            {symbolInfo.name} is a cryptocurrency trading on Binance.
                            Real-time price updates are fetched every 4 seconds to ensure
                            you have the latest market information. Pull down to refresh all data.
                        </Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.buyButton}>
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

                    <TouchableOpacity style={styles.sellButton}>
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
    rotating: {
        transform: [{ rotate: '360deg' }],
    },
    priceSection: {
        alignItems: 'center',
        marginTop: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    currentPrice: {
        fontSize: 36,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    updatingIndicator: {
        marginTop: 8,
    },
    pulseDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
        animation: 'pulse 1s ease-in-out infinite',
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
        fontWeight: '500',
    },
    chartWrapper: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
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
    infoSection: {
        paddingHorizontal: 20,
        marginTop: 24,
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    infoDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
    },
    infoLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    aboutSection: {
        paddingHorizontal: 20,
        marginTop: 24,
    },
    aboutTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 12,
    },
    aboutCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    aboutText: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 22,
    },
    actionButtons: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 24,
        marginBottom: 24,
        gap: 12,
    },
    buyButton: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    sellButton: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});