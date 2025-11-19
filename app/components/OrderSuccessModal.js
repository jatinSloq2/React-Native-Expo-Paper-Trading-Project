// OrderSuccessModal.js - Create this as a new component file
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
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const OrderSuccessModal = ({ visible, onClose, orderData, orderType }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const bounceAnim = useRef(new Animated.Value(0)).current;

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
                Animated.sequence([
                    Animated.spring(bounceAnim, {
                        toValue: 1.2,
                        friction: 3,
                        tension: 40,
                        useNativeDriver: true,
                    }),
                    Animated.spring(bounceAnim, {
                        toValue: 1,
                        friction: 5,
                        tension: 40,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start();
        } else {
            scaleAnim.setValue(0);
            fadeAnim.setValue(0);
            bounceAnim.setValue(0);
        }
    }, [visible]);

    if (!visible) return null;

    const isBuy = orderType === 'BUY';
    const gradientColors = isBuy ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626'];

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
        >
            <Animated.View
                style={[
                    styles.overlay,
                    { opacity: fadeAnim }
                ]}
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
                    {/* Header with gradient */}
                    <LinearGradient
                        colors={gradientColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.header}
                    >
                        {/* Animated Success Icon */}
                        <Animated.View
                            style={[
                                styles.iconContainer,
                                { transform: [{ scale: bounceAnim }] }
                            ]}
                        >
                            <View style={styles.iconBackground}>
                                <Feather name="check-circle" size={48} color={isBuy ? '#10B981' : '#EF4444'} />
                            </View>
                        </Animated.View>

                        <Text style={styles.title}>Order Placed Successfully! 🎉</Text>
                        <Text style={styles.subtitle}>
                            Your {orderType.toLowerCase()} order has been executed
                        </Text>
                    </LinearGradient>

                    {/* Order Details */}
                    <View style={styles.content}>
                        {/* Order Type Badge */}
                        <View style={styles.badgeContainer}>
                            <View style={[styles.badge, { backgroundColor: isBuy ? '#DCFCE7' : '#FEE2E2' }]}>
                                <Feather
                                    name={isBuy ? 'trending-up' : 'trending-down'}
                                    size={16}
                                    color={isBuy ? '#059669' : '#DC2626'}
                                />
                                <Text style={[styles.badgeText, { color: isBuy ? '#059669' : '#DC2626' }]}>
                                    {orderType} Order
                                </Text>
                            </View>
                        </View>

                        {/* Details Card */}
                        <View style={styles.detailsCard}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Symbol</Text>
                                <Text style={styles.detailValueLarge}>{orderData.symbol}</Text>
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
                                            styles.detailValueBold,
                                            { color: orderData.pnl >= 0 ? '#10B981' : '#EF4444' }
                                        ]}>
                                            {orderData.pnl >= 0 ? '+' : ''}${orderData.pnl}
                                        </Text>
                                    </View>
                                </>
                            )}

                            <View style={styles.dividerBold} />

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabelBold}>Total</Text>
                                <Text style={[
                                    styles.detailValueTotal,
                                    { color: isBuy ? '#EF4444' : '#10B981' }
                                ]}>
                                    ${orderData.total}
                                </Text>
                            </View>
                        </View>

                        {/* Info Box */}
                        <View style={styles.infoBox}>
                            <Feather name="info" size={16} color="#2563EB" />
                            <Text style={styles.infoText}>
                                Virtual trading with simulated charges for educational purposes
                            </Text>
                        </View>
                    </View>

                    {/* Action Button */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={onClose}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={gradientColors}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.buttonText}>Continue Trading</Text>
                                <Feather name="arrow-right" size={20} color="#FFFFFF" />
                            </LinearGradient>
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
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: width - 40,
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 20,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 24,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 16,
    },
    iconBackground: {
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
    },
    content: {
        padding: 24,
    },
    badgeContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 14,
        fontWeight: '600',
    },
    detailsCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
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
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    detailValueLarge: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    detailValueBold: {
        fontSize: 14,
        fontWeight: '700',
    },
    detailLabelBold: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },
    detailValueTotal: {
        fontSize: 20,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 4,
    },
    dividerBold: {
        height: 2,
        backgroundColor: '#D1D5DB',
        marginVertical: 8,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        padding: 16,
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        color: '#1E40AF',
        lineHeight: 18,
    },
    footer: {
        padding: 24,
        paddingTop: 0,
    },
    button: {
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});

export default OrderSuccessModal;