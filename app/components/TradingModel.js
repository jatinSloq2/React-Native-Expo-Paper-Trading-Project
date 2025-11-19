import { Feather } from '@expo/vector-icons';
import { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from "../api/axiosInstance";

const { width } = Dimensions.get('window');

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
    setLastOrderType,
    fetchUser,
    isWatchlisted,
    onToggleWatchlist
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
    const [addingToWatchlist, setAddingToWatchlist] = useState(false);
    const [fetchingPosition, setFetchingPosition] = useState(false);

    const currentPrice = stock.price || 0;
    const TRADING_FEE = 0.1;
    const GST = 18;
    const TRANSACTION_FEE = 2;
    const STT = orderType === 'SELL' ? 0.025 : 0;

    // Extract symbol without USDT suffix for API calls
    const getSymbolForAPI = () => {
        return stock.symbol.replace('USDT', '').toUpperCase();
    };

    useEffect(() => {
        if (visible && orderType === 'SELL') {
            fetchExistingPosition();
        } else if (visible) {
            // Reset position when opening for BUY
            setExistingPosition(null);
        }
    }, [visible, orderType, stock.symbol]);

    const fetchExistingPosition = async () => {
        setFetchingPosition(true);
        try {
            const symbolForAPI = getSymbolForAPI();
            const response = await axiosInstance.get('/trading/positions/symbol', {
                params: { symbol: symbolForAPI },
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-API-Key': apiKey || '',
                },
            });

            if (response.data.success && response.data.data.length > 0) {
                // Get the first active position for this symbol
                const position = response.data.data[0];
                setExistingPosition(position);
            } else {
                setExistingPosition(null);
                if (orderType === 'SELL') {
                    Alert.alert(
                        'No Position',
                        `You do not have an active position for ${symbolForAPI}`
                    );
                }
            }
        } catch (error) {
            console.error('Error fetching position:', error);
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to fetch position details'
            );
            
            setExistingPosition(null);
        } finally {
            setFetchingPosition(false);
        }
    };

    const handleAddToWatchlist = async () => {
        if (!user || !token) {
            Alert.alert('Not Logged In', 'Please login to add to watchlist');
            return;
        }

        if (!onToggleWatchlist) {
            Alert.alert('Error', 'Watchlist functionality not available');
            return;
        }

        setAddingToWatchlist(true);
        try {
            await onToggleWatchlist();
            Alert.alert('Success', 'Added to watchlist successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to add to watchlist');
        } finally {
            setAddingToWatchlist(false);
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
            const symbolForAPI = getSymbolForAPI();
            const orderData = {
                symbol: symbolForAPI,
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

                // Reset form
                setQuantity('');
                setLimitPrice('');
                setStopLoss('');
                setTakeProfit('');
                setExecutionType('MARKET');
                setShowAdvanced(false);

                setLastOrderType(orderType);

                setSuccessOrderData({
                    symbol: symbolForAPI,
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
            if (fetchUser) fetchUser();
        }
    };

    const quickAmounts = [1000, 2000, 5000, 10000];

    // Only show watchlist button if the function is provided and user is not selling
    const showWatchlistButton = onToggleWatchlist && !isWatchlisted && orderType === 'BUY';

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

                        {/* Add to Watchlist Button - Only show when function is provided */}
                        {showWatchlistButton && (
                            <TouchableOpacity
                                style={styles.watchlistAddButton}
                                onPress={handleAddToWatchlist}
                                disabled={addingToWatchlist}
                            >
                                {addingToWatchlist ? (
                                    <ActivityIndicator size="small" color="#2E5CFF" />
                                ) : (
                                    <>
                                        <Feather name="star" size={16} color="#2E5CFF" />
                                        <Text style={styles.watchlistAddText}>Add to Watchlist</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        )}

                        {/* Position Info for SELL orders */}
                        {orderType === 'SELL' && (
                            fetchingPosition ? (
                                <View style={styles.positionLoadingCard}>
                                    <ActivityIndicator size="small" color="#2E5CFF" />
                                    <Text style={styles.positionLoadingText}>Loading position...</Text>
                                </View>
                            ) : existingPosition ? (
                                <View style={styles.positionInfoCard}>
                                    <Text style={styles.positionInfoLabel}>Available Quantity</Text>
                                    <Text style={styles.positionInfoValue}>
                                        {existingPosition.totalQuantity} {stock.symbol.replace('USDT', '')}
                                    </Text>
                                    <Text style={styles.positionInfoSubtext}>
                                        Avg Price: ${existingPosition.averagePrice.toFixed(2)}
                                    </Text>
                                    <Text style={styles.positionInfoSubtext}>
                                        Current Value: ${(existingPosition.totalQuantity * currentPrice).toFixed(2)}
                                    </Text>
                                </View>
                            ) : (
                                <View style={styles.noPositionCard}>
                                    <Feather name="alert-circle" size={20} color="#EF4444" />
                                    <Text style={styles.noPositionText}>
                                        No active position found for {stock.symbol.replace('USDT', '')}
                                    </Text>
                                </View>
                            )
                        )}

                        <View style={styles.currentPriceCard}>
                            <Text style={styles.currentPriceLabel}>Current Market Price</Text>
                            <Text style={styles.currentPriceValue}>
                                ${currentPrice >= 1 ? currentPrice.toFixed(2) : currentPrice.toFixed(6)}
                            </Text>
                        </View>

                        {user && orderType === 'BUY' && (
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
                            placeholder={orderType === 'SELL' && existingPosition
                                ? `Max: ${existingPosition.totalQuantity}`
                                : "Enter quantity"}
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

                        {orderType === 'SELL' && existingPosition && (
                            <TouchableOpacity
                                style={styles.maxQuantityButton}
                                onPress={() => setQuantity(existingPosition.totalQuantity.toString())}
                            >
                                <Text style={styles.maxQuantityText}>Use Max Quantity</Text>
                            </TouchableOpacity>
                        )}

                        {executionType === 'LIMIT' && (
                            <>
                                <Text style={styles.inputLabel}>Limit Price</Text>
                                <TextInput
                                    style={styles.input}
                                    value={limitPrice}
                                    onChangeText={setLimitPrice}
                                    placeholder={`Current: $${currentPrice >= 1 ? currentPrice.toFixed(2) : currentPrice.toFixed(6)}`}
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
                                    <Text style={styles.summaryValue}>
                                        ${orderSummary.price >= 1 ? orderSummary.price.toFixed(2) : orderSummary.price.toFixed(6)}
                                    </Text>
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
                                    (loading || !orderSummary || (orderType === 'SELL' && !existingPosition)) && styles.submitButtonDisabled
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
                                Virtual trading with simulated charges for educational purposes only. All trades are fake and no real money is involved.
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

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

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        maxHeight: '90%',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10,
    },
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
    watchlistAddButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EEF3FF',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 16,
        gap: 8,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    watchlistAddText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2E5CFF',
    },
    positionInfoCard: {
        backgroundColor: '#FEF3C7',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    positionInfoLabel: {
        fontSize: 12,
        color: '#92400E',
        marginBottom: 4,
    },
    positionInfoValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#78350F',
        marginBottom: 4,
    },
    positionInfoSubtext: {
        fontSize: 12,
        color: '#92400E',
    },
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
    inputLabel: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 6,
        marginTop: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 14,
    },
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
    },
});

export default TradingModal

