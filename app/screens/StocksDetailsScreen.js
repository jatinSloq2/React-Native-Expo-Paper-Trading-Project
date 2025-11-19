import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext';
import OrderSuccessModal from '../components/OrderSuccessModal';

const { width } = Dimensions.get('window');

// Enhanced function to get crypto logo
const getCryptoLogoUrl = (symbol) => {
    const baseAsset = symbol.replace('USDT', '').toLowerCase();
    const projectSlugs = {
        btc: 'bitcoin', eth: 'ethereum', bnb: 'binance-coin',
        matic: 'polygon', sol: 'solana', xrp: 'xrp',
        ada: 'cardano', doge: 'dogecoin', dot: 'polkadot',
        shib: 'shiba-inu', uni: 'uniswap', link: 'chainlink',
        avax: 'avalanche', atom: 'cosmos', hbar: 'hedera',
        vet: 'vechain', fil: 'filecoin', etc: 'ethereum-classic',
        xlm: 'stellar', trx: 'tron', xtz: 'tezos',
        algo: 'algorand', near: 'near-protocol', ftm: 'fantom',
        apt: 'aptos', arb: 'arbitrum', op: 'optimism',
        grt: 'the-graph', sand: 'the-sandbox', mana: 'decentraland',
        pepe: 'pepe', bonk: 'bonk', wif: 'dogwifhat'
    };
    const slug = projectSlugs[baseAsset] || baseAsset;
    return `https://cryptologos.cc/logos/${slug}-${baseAsset}-logo.png`;
};

const getSymbolInfo = (symbol) => {
    const baseAsset = symbol.replace('USDT', '');
    const colors = {
        'BTC': '#F7931A', 'ETH': '#627EEA', 'BNB': '#F3BA2F',
        'SOL': '#14F195', 'XRP': '#23292F', 'ADA': '#0033AD',
        'DOGE': '#C2A633', 'MATIC': '#8247E5', 'DOT': '#E6007A'
    };
    return {
        name: baseAsset,
        color: colors[baseAsset] || '#2E5CFF',
        image: getCryptoLogoUrl(symbol)
    };
};

// Trading Modal Component
const TradingModal = ({
    visible,
    onClose,
    stock,
    orderType,
    userBalance = 0,
    onOrderSuccess,
    user,
    setSuccessOrderData,
    setShowSuccessModal,
    setLastOrderType, fetchUser
}) => {
    const { token, apiKey } = useContext(AuthContext);
    const [executionType, setExecutionType] = useState('MARKET');
    const [quantity, setQuantity] = useState('');
    const [limitPrice, setLimitPrice] = useState('');
    const [stopLoss, setStopLoss] = useState('');
    const [takeProfit, setTakeProfit] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [loading, setLoading] = useState(false);
    const [existingPosition, setExistingPosition] = useState(null);

    const currentPrice = stock.price || 0;
    const TRADING_FEE = 0.1;
    const GST = 18;
    const TRANSACTION_FEE = 2;
    const STT = orderType === 'SELL' ? 0.025 : 0;

    useEffect(() => {
        if (visible && orderType === 'SELL') {
            fetchExistingPosition();
        }
    }, [visible, orderType]);

    const fetchExistingPosition = async () => {
        try {
            const response = await axiosInstance.get('/trading/positions', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-API-Key': apiKey || '',
                },
            });
            const position = response.data.data.find(p => p.symbol === stock.symbol && p.status === 'ACTIVE');
            setExistingPosition(position);
            if (!position) {
                Alert.alert('No Position', 'You do not have an active position for this asset');
            }
        } catch (error) {
            console.error('Error fetching position:', error);
        }
    };

    const calculateCharges = (amount) => {
        const tradingFee = (amount * TRADING_FEE) / 100;
        const gst = (tradingFee * GST) / 100;
        const stt = (amount * STT) / 100;
        const total = tradingFee + gst + TRANSACTION_FEE + stt;
        return {
            tradingFee: parseFloat(tradingFee.toFixed(2)),
            gst: parseFloat(gst.toFixed(2)),
            transactionFee: TRANSACTION_FEE,
            stt: parseFloat(stt.toFixed(2)),
            total: parseFloat(total.toFixed(2))
        };
    };

    const orderSummary = quantity && parseFloat(quantity) > 0 ? (() => {
        const price = executionType === 'LIMIT' && limitPrice ? parseFloat(limitPrice) : currentPrice;
        const investedAmount = parseFloat(quantity) * price;
        const charges = calculateCharges(investedAmount);
        const totalCost = investedAmount + charges.total;
        return {
            quantity: parseFloat(quantity),
            price,
            investedAmount: investedAmount.toFixed(2),
            charges,
            totalCost: totalCost.toFixed(2),
            netAmount: orderType === 'BUY' ? totalCost.toFixed(2) : (investedAmount - charges.total).toFixed(2)
        };
    })() : null;

    const handleSubmit = async () => {
        if (!quantity || parseFloat(quantity) <= 0) {
            Alert.alert('Error', 'Please enter a valid quantity');
            return;
        }

        if (orderType === 'BUY' && orderSummary && parseFloat(orderSummary.totalCost) > userBalance) {
            Alert.alert('Insufficient Balance', `Your balance: $${userBalance.toFixed(2)}`);
            return;
        }

        if (orderType === 'SELL') {
            if (!existingPosition) {
                Alert.alert('Error', 'No active position found for this asset');
                return;
            }
            if (parseFloat(quantity) > existingPosition.totalQuantity) {
                Alert.alert('Insufficient Quantity', `Available: ${existingPosition.totalQuantity}`);
                return;
            }
        }

        if (executionType === 'LIMIT' && (!limitPrice || parseFloat(limitPrice) <= 0)) {
            Alert.alert('Error', 'Please enter a valid limit price');
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                symbol: stock.symbol,
                quantity: parseFloat(quantity),
                orderType: executionType,
                currentPrice: currentPrice,
                limitPrice: limitPrice && limitPrice.trim() !== '' ? parseFloat(limitPrice) : undefined,
                stopLossPrice: stopLoss && stopLoss.trim() !== '' ? parseFloat(stopLoss) : undefined,
                takeProfitPrice: takeProfit && takeProfit.trim() !== '' ? parseFloat(takeProfit) : undefined,
            };

            const endpoint = orderType === 'BUY' ? '/trading/order/buy' : '/trading/order/sell';

            const response = await axiosInstance.post(endpoint, orderData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-API-Key': apiKey || '',
                },
            });

            if (response.data.success) {
                const { order, position, charges, netPnl } = response.data.data;

                setQuantity('');
                setLimitPrice('');
                setStopLoss('');
                setTakeProfit('');

                setLastOrderType(orderType);

                setSuccessOrderData({
                    symbol: stock.symbol.replace('USDT', ''),
                    quantity: order.quantity.toFixed(6),
                    price: order.entryPrice.toFixed(2),
                    total: orderSummary.netAmount,
                    pnl: orderType === 'SELL' ? netPnl?.toFixed(2) : undefined,
                });

                onClose();

                setTimeout(() => {
                    setShowSuccessModal(true);
                }, 300);

                if (onOrderSuccess) onOrderSuccess();
            }
        } catch (error) {
            console.error("❌ Order Error:", error.response?.data || error.message);
            Alert.alert(
                "Order Failed",
                error.response?.data?.message || "Failed to place order. Please try again."
            );
        } finally {
            setLoading(false);
            fetchUser()
        }
    };

    const quickAmounts = [1000, 2000, 5000, 10000];

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {orderType} {stock.symbol.replace('USDT', '')}
                            </Text>
                            <TouchableOpacity onPress={onClose}>
                                <Feather name="x" size={24} color="#1A1A1A" />
                            </TouchableOpacity>
                        </View>

                        {orderType === 'SELL' && existingPosition && (
                            <View style={styles.positionInfoCard}>
                                <Text style={styles.positionInfoLabel}>Available Quantity</Text>
                                <Text style={styles.positionInfoValue}>
                                    {existingPosition.totalQuantity} {stock.symbol.replace('USDT', '')}
                                </Text>
                                <Text style={styles.positionInfoSubtext}>
                                    Avg Price: ${existingPosition.averagePrice.toFixed(2)}
                                </Text>
                            </View>
                        )}

                        <View style={styles.currentPriceCard}>
                            <Text style={styles.currentPriceLabel}>Current Price</Text>
                            <Text style={styles.currentPriceValue}>${currentPrice.toFixed(2)}</Text>
                        </View>

                        {user && (
                            <View style={styles.currentPriceCard}>
                                <Text style={styles.currentPriceLabel}>Available Balance</Text>
                                <Text style={styles.currentPriceValue}>${userBalance.toFixed(2)}</Text>
                            </View>
                        )}

                        <Text style={styles.inputLabel}>Order Type</Text>
                        <View style={styles.executionTypeContainer}>
                            {['MARKET', 'LIMIT'].map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[
                                        styles.executionTypeButton,
                                        executionType === type && styles.executionTypeButtonActive
                                    ]}
                                    onPress={() => setExecutionType(type)}
                                >
                                    <Text style={[
                                        styles.executionTypeText,
                                        executionType === type && styles.executionTypeTextActive
                                    ]}>
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.inputLabel}>Quantity</Text>
                        <TextInput
                            style={styles.input}
                            value={quantity}
                            onChangeText={setQuantity}
                            placeholder="Enter quantity"
                            keyboardType="decimal-pad"
                        />

                        {orderType === 'BUY' && (
                            <View style={styles.quickAmountContainer}>
                                {quickAmounts.map((amt) => (
                                    <TouchableOpacity
                                        key={amt}
                                        style={styles.quickAmountButton}
                                        onPress={() => setQuantity((amt / currentPrice).toFixed(6))}
                                    >
                                        <Text style={styles.quickAmountText}>${amt}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {executionType === 'LIMIT' && (
                            <>
                                <Text style={styles.inputLabel}>Limit Price</Text>
                                <TextInput
                                    style={styles.input}
                                    value={limitPrice}
                                    onChangeText={setLimitPrice}
                                    placeholder={`Current: $${currentPrice.toFixed(2)}`}
                                    keyboardType="decimal-pad"
                                />
                            </>
                        )}

                        <TouchableOpacity
                            style={styles.advancedToggle}
                            onPress={() => setShowAdvanced(!showAdvanced)}
                        >
                            <Text style={styles.advancedToggleText}>
                                {showAdvanced ? '− Hide' : '+ Show'} Advanced Options
                            </Text>
                        </TouchableOpacity>

                        {showAdvanced && (
                            <View style={styles.advancedContainer}>
                                <Text style={styles.inputLabel}>Stop Loss (Optional)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={stopLoss}
                                    onChangeText={setStopLoss}
                                    placeholder="Enter stop loss price"
                                    keyboardType="decimal-pad"
                                />

                                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Take Profit (Optional)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={takeProfit}
                                    onChangeText={setTakeProfit}
                                    placeholder="Enter take profit price"
                                    keyboardType="decimal-pad"
                                />

                                <View style={styles.infoBox}>
                                    <Feather name="info" size={14} color="#2E5CFF" />
                                    <Text style={styles.infoText}>
                                        Orders will auto-execute when price reaches your targets
                                    </Text>
                                </View>
                            </View>
                        )}

                        {orderSummary && (
                            <View style={styles.summaryCard}>
                                <Text style={styles.summaryTitle}>Order Summary</Text>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Quantity</Text>
                                    <Text style={styles.summaryValue}>
                                        {orderSummary.quantity} {stock.symbol.replace('USDT', '')}
                                    </Text>
                                </View>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Price</Text>
                                    <Text style={styles.summaryValue}>${orderSummary.price.toFixed(2)}</Text>
                                </View>
                                <View style={styles.summaryDivider} />
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Order Value</Text>
                                    <Text style={styles.summaryValue}>${orderSummary.investedAmount}</Text>
                                </View>
                                <View style={styles.chargesContainer}>
                                    <View style={styles.chargeRow}>
                                        <Text style={styles.chargeLabel}>Trading Fee (0.1%)</Text>
                                        <Text style={styles.chargeValue}>${orderSummary.charges.tradingFee}</Text>
                                    </View>
                                    <View style={styles.chargeRow}>
                                        <Text style={styles.chargeLabel}>GST (18%)</Text>
                                        <Text style={styles.chargeValue}>${orderSummary.charges.gst}</Text>
                                    </View>
                                    <View style={styles.chargeRow}>
                                        <Text style={styles.chargeLabel}>Transaction Fee</Text>
                                        <Text style={styles.chargeValue}>${orderSummary.charges.transactionFee}</Text>
                                    </View>
                                    {orderType === 'SELL' && (
                                        <View style={styles.chargeRow}>
                                            <Text style={styles.chargeLabel}>STT (0.025%)</Text>
                                            <Text style={styles.chargeValue}>${orderSummary.charges.stt}</Text>
                                        </View>
                                    )}
                                    <View style={[styles.chargeRow, { marginTop: 8 }]}>
                                        <Text style={styles.chargeLabelBold}>Total Charges</Text>
                                        <Text style={styles.chargeValueBold}>${orderSummary.charges.total}</Text>
                                    </View>
                                </View>
                                <View style={styles.summaryDivider} />
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabelBold}>
                                        {orderType === 'BUY' ? 'Total Payable' : 'You Will Receive'}
                                    </Text>
                                    <Text style={[
                                        styles.summaryValueBold,
                                        { color: orderType === 'BUY' ? '#EF4444' : '#10B981' }
                                    ]}>
                                        ${orderSummary.netAmount}
                                    </Text>
                                </View>
                            </View>
                        )}

                        <View style={styles.actionButtonsContainer}>
                            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.submitButton,
                                    orderType === 'BUY' ? styles.buyButton : styles.sellButton,
                                    loading && styles.submitButtonDisabled
                                ]}
                                onPress={handleSubmit}
                                disabled={loading || !orderSummary || (orderType === 'SELL' && !existingPosition)}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.submitButtonText}>
                                        {orderType === 'BUY' ? 'Buy Now' : 'Sell Now'}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.disclaimer}>
                            <Feather name="alert-circle" size={12} color="#F59E0B" />
                            <Text style={styles.disclaimerText}>
                                Virtual trading with simulated charges for educational purposes
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};


// Main Component
export default function CryptoDetailsScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { stock: initialStock } = route.params;
    const { user, token, apiKey, fetchUser } = useContext(AuthContext);

    const [stock, setStock] = useState(initialStock);
    const [refreshing, setRefreshing] = useState(false);
    const [isWatchlisted, setIsWatchlisted] = useState(false);
    const [selectedTimeframe, setSelectedTimeframe] = useState('24H');
    const [chartData, setChartData] = useState({ labels: [], data: [] });
    const [chartLoading, setChartLoading] = useState(true);
    const [showTradingModal, setShowTradingModal] = useState(false);
    const [tradeType, setTradeType] = useState('BUY');
    const [userBalance, setUserBalance] = useState(0);
    const updateIntervalRef = useRef(null);

    const [lastOrderType, setLastOrderType] = useState('BUY');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successOrderData, setSuccessOrderData] = useState(null);

    const symbolInfo = getSymbolInfo(stock.symbol);
    const isPositive = stock.change >= 0;

    // Fetch user balance
    const fetchUserBalance = async () => {
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

    // Update stock data
    const updateStockData = async () => {
        try {
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
        } catch (error) {
            console.error('Error updating stock:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await Promise.all([updateStockData(), fetchChartData(selectedTimeframe), fetchUserBalance()]);
        setRefreshing(false);
    };

    useEffect(() => {
        if (user && token) {
            fetchUserBalance();
        }
        updateStockData();
        fetchChartData(selectedTimeframe);

        updateIntervalRef.current = setInterval(() => {
            updateStockData();
        }, 4000);

        return () => {
            if (updateIntervalRef.current) {
                clearInterval(updateIntervalRef.current);
            }
        };
    }, [stock.symbol]);

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

    const handleOrderSuccess = () => {
        fetchUserBalance();
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
                            <Feather name="refresh-cw" size={18} color="#FFFFFF" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.watchlistButton}
                            onPress={() => setIsWatchlisted(!isWatchlisted)}
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
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
                        </View>
                    ) : chartData.data.length > 0 ? (
                        <LineChart
                            data={{
                                labels: chartData.labels.filter(label => label !== ''),
                                datasets: [{ data: chartData.data }]
                            }}
                            width={width - 60}
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
                    ) : null}
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
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingHorizontal: 10,
    },

    buyButtonMain: {
        flex: 1,
        marginRight: 8,
        borderRadius: 12,
        overflow: 'hidden',
    },

    sellButtonMain: {
        flex: 1,
        marginLeft: 8,
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
    container: {
        flex: 1,
        backgroundColor: '#F5F7FB',
    },

    /* HEADER */
    header: {
        paddingTop: 55,
        paddingBottom: 20,
        paddingHorizontal: 18,
        borderBottomLeftRadius: 22,
        borderBottomRightRadius: 22,
        elevation: 5,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },

    /* MODAL OVERLAY */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },

    /* MODAL CONTENT */
    modalContent: {
        maxHeight: '90%',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10,
    },

    /* MODAL HEADER */
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
    },

    /* CURRENT PRICE */
    currentPriceCard: {
        backgroundColor: '#EEF3FF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    currentPriceLabel: {
        fontSize: 13,
        color: '#6B7280',
    },
    currentPriceValue: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A3FCC',
        marginTop: 4,
    },

    /* INPUT LABEL */
    inputLabel: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 6,
        marginTop: 8,
        fontWeight: '600',
    },

    /* TEXT INPUT */
    input: {
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 14,
    },

    /* EXECUTION TYPE */
    executionTypeContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 18,
    },
    executionTypeButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
    },
    executionTypeButtonActive: {
        backgroundColor: '#2E5CFF',
    },
    executionTypeText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
    },
    executionTypeTextActive: {
        color: '#FFFFFF',
    },

    /* QUICK AMOUNTS */
    quickAmountContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    quickAmountButton: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    quickAmountText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },

    /* ADVANCED OPTIONS */
    advancedToggle: {
        paddingVertical: 6,
        alignItems: 'center',
        marginBottom: 10,
    },
    advancedToggleText: {
        color: '#2563EB',
        fontSize: 14,
        fontWeight: '600',
    },
    advancedContainer: {
        backgroundColor: '#F9FAFB',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 16,
    },
    infoBox: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    infoText: {
        marginLeft: 8,
        color: '#2563EB',
        fontSize: 12,
        flex: 1,
    },

    /* SUMMARY CARD */
    summaryCard: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 20,
    },
    summaryTitle: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 12,
        color: '#111827',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryLabel: {
        color: '#6B7280',
        fontSize: 14,
    },
    summaryValue: {
        color: '#111827',
        fontSize: 14,
        fontWeight: '600',
    },
    summaryDivider: {
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        marginVertical: 10,
    },

    /* CHARGES */
    chargesContainer: {
        marginBottom: 12,
        marginTop: 6,
    },
    chargeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    chargeLabel: {
        fontSize: 13,
        color: '#6B7280',
    },
    chargeValue: {
        fontSize: 13,
        color: '#111827',
        fontWeight: '600',
    },
    chargeLabelBold: {
        fontSize: 14,
        fontWeight: '700',
        color: '#374151',
    },
    chargeValueBold: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
    },

    summaryLabelBold: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
    },
    summaryValueBold: {
        fontSize: 16,
        fontWeight: '700',
    },

    /* ACTION BUTTONS */
    actionButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
    },
    cancelButton: {
        flex: 1,
        padding: 14,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    cancelButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },
    submitButton: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    buyButton: {
        backgroundColor: '#10B981',
    },
    sellButton: {
        backgroundColor: '#EF4444',
    },
    submitButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },

    /* DISCLAIMER */
    disclaimer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        paddingVertical: 4,
    },
    disclaimerText: {
        marginLeft: 6,
        fontSize: 12,
        color: '#6B7280',
        flex: 1,
    }

});