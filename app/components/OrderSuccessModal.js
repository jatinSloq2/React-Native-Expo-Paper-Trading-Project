// OrderSuccessModal.js - Clean & Professional Version
import React, { useEffect, useRef } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const OrderSuccessModal = ({ visible, onClose, orderData, orderType }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            scaleAnim.setValue(0);
            fadeAnim.setValue(0);
        }
    }, [visible]);

    if (!visible) return null;

    const isBuy = orderType === 'BUY';

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
        >
            <Animated.View
                style={[styles.overlay, { opacity: fadeAnim }]}
            >
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={onClose}
                />

                <Animated.View
                    style={[
                        styles.container,
                        {
                            transform: [{ scale: scaleAnim }],
                            opacity: fadeAnim,
                        }
                    ]}
                >
                    {/* Success Icon */}
                    <View style={[
                        styles.iconContainer,
                        { backgroundColor: isBuy ? '#DCFCE7' : '#FEE2E2' }
                    ]}>
                        <Feather
                            name="check-circle"
                            size={56}
                            color={isBuy ? '#10B981' : '#EF4444'}
                        />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Order Placed Successfully</Text>
                    <Text style={styles.subtitle}>
                        Your {orderType.toLowerCase()} order has been executed
                    </Text>

                    {/* Order Details Card */}
                    <View style={styles.detailsCard}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Symbol</Text>
                            <Text style={styles.detailValue}>{orderData.symbol}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Quantity</Text>
                            <Text style={styles.detailValue}>{orderData.quantity}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Price</Text>
                            <Text style={styles.detailValue}>${orderData.price}</Text>
                        </View>

                        {orderData.pnl !== undefined && (
                            <>
                                <View style={styles.divider} />
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>P&L</Text>
                                    <Text style={[
                                        styles.detailValue,
                                        styles.pnlValue,
                                        { color: parseFloat(orderData.pnl) >= 0 ? '#10B981' : '#EF4444' }
                                    ]}>
                                        {parseFloat(orderData.pnl) >= 0 ? '+' : ''}${orderData.pnl}
                                    </Text>
                                </View>
                            </>
                        )}

                        <View style={styles.dividerBold} />

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabelBold}>Total Amount</Text>
                            <Text style={[
                                styles.detailValueBold,
                                { color: isBuy ? '#1A1A1A' : '#1A1A1A' }
                            ]}>
                                ${orderData.total}
                            </Text>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.primaryButton,
                                { backgroundColor: isBuy ? '#10B981' : '#EF4444' }
                            ]}
                            onPress={onClose}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: width - 40,
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 20,
    },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    detailsCard: {
        width: '100%',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    pnlValue: {
        fontWeight: '700',
    },
    detailLabelBold: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    detailValueBold: {
        fontSize: 18,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 4,
    },
    dividerBold: {
        height: 1,
        backgroundColor: '#D1D5DB',
        marginVertical: 8,
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButton: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});

export default OrderSuccessModal;