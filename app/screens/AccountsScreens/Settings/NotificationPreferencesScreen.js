import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { AuthContext } from '../../../../context/AuthContext';
import axiosInstance from '../../../api/axiosInstance';

export default function NotificationPreferencesScreen() {
    const navigation = useNavigation();
    const { user, setUser } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [preferences, setPreferences] = useState({
        email: user?.notificationPreferences?.email ?? true,
        push: user?.notificationPreferences?.push ?? true,
        sms: user?.notificationPreferences?.sms ?? false,
        tradeExecutions: user?.notificationPreferences?.tradeExecutions ?? true,
        marketNews: user?.notificationPreferences?.marketNews ?? true,
        priceAlerts: user?.notificationPreferences?.priceAlerts ?? true,
    });

    // Update notification preference on backend
    const updatePreference = async (prefName, value) => {
        const token = await AsyncStorage.getItem("token");
        const apiKey = await AsyncStorage.getItem("api_key");

        try {
            setLoading(true);
            const response = await axiosInstance.put(
                '/auth/notification-preferences',
                {
                    [prefName]: value
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "X-API-Key": apiKey || "",
                    }
                }
            );

            if (response.data.success) {
                // Update user context
                setUser({
                    ...user,
                    notificationPreferences: {
                        ...user.notificationPreferences,
                        [prefName]: value
                    }
                });

                // Save to AsyncStorage
                await AsyncStorage.setItem('userNotificationPreferences', JSON.stringify({
                    ...user.notificationPreferences,
                    [prefName]: value
                }));
            }
            setLoading(false);
            return true;
        } catch (error) {
            console.error('Failed to update preference:', error);
            setLoading(false);
            Alert.alert('Error', 'Failed to update notification preferences. Please try again.');
            return false;
        }
    };

    const handleToggle = async (prefName, value) => {
        // Update local state immediately for better UX
        setPreferences(prev => ({ ...prev, [prefName]: value }));

        const success = await updatePreference(prefName, value);
        if (!success) {
            // Revert on failure
            setPreferences(prev => ({ ...prev, [prefName]: !value }));
        }
    };

    const handleEmailToggle = async (value) => {
        if (!value && preferences.push === false && preferences.sms === false) {
            Alert.alert(
                'Cannot Disable',
                'You must keep at least one notification channel enabled.',
                [{ text: 'OK' }]
            );
            return;
        }
        await handleToggle('email', value);
    };

    const handlePushToggle = async (value) => {
        if (!value && preferences.email === false && preferences.sms === false) {
            Alert.alert(
                'Cannot Disable',
                'You must keep at least one notification channel enabled.',
                [{ text: 'OK' }]
            );
            return;
        }
        await handleToggle('push', value);
    };

    const handleSmsToggle = async (value) => {
        if (!value && preferences.email === false && preferences.push === false) {
            Alert.alert(
                'Cannot Disable',
                'You must keep at least one notification channel enabled.',
                [{ text: 'OK' }]
            );
            return;
        }

        if (value) {
            Alert.alert(
                'SMS Notifications',
                'SMS notifications may incur additional charges from your mobile carrier.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Enable',
                        onPress: () => handleToggle('sms', value)
                    }
                ]
            );
        } else {
            await handleToggle('sms', value);
        }
    };

    return (
        <View style={styles.container}>
            {/* Fixed Header */}
            <LinearGradient
                colors={['#2E5CFF', '#1A3FCC']}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Feather name="arrow-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notification Preferences</Text>
                <View style={styles.headerRight} />
            </LinearGradient>

            {/* Loading Overlay */}
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#2E5CFF" />
                </View>
            )}

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >


                {/* Notification Channels */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notification Channels</Text>
                    <Text style={styles.sectionSubtitle}>Choose how you want to be notified</Text>

                    <NotificationToggle
                        icon="mail"
                        label="Email Notifications"
                        subtitle="Receive notifications via email"
                        value={preferences.email}
                        onValueChange={handleEmailToggle}
                    />
                    <NotificationToggle
                        icon="smartphone"
                        label="Push Notifications"
                        subtitle="Receive notifications on your device"
                        value={preferences.push}
                        onValueChange={handlePushToggle}
                    />
                    <NotificationToggle
                        icon="message-square"
                        label="SMS Notifications"
                        subtitle="Receive notifications via text message"
                        value={preferences.sms}
                        onValueChange={handleSmsToggle}
                    />
                </View>

                {/* Notification Types */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>What to Notify</Text>
                    <Text style={styles.sectionSubtitle}>Select the types of notifications you want to receive</Text>

                    <NotificationToggle
                        icon="check-circle"
                        label="Trade Executions"
                        subtitle="Get notified when your trades are executed"
                        value={preferences.tradeExecutions}
                        onValueChange={(value) => handleToggle('tradeExecutions', value)}
                    />
                    <NotificationToggle
                        icon="trending-up"
                        label="Market News"
                        subtitle="Stay updated with important market news"
                        value={preferences.marketNews}
                        onValueChange={(value) => handleToggle('marketNews', value)}
                    />
                    <NotificationToggle
                        icon="bell"
                        label="Price Alerts"
                        subtitle="Receive alerts when stocks hit your targets"
                        value={preferences.priceAlerts}
                        onValueChange={(value) => handleToggle('priceAlerts', value)}
                    />
                </View>

                {/* Help Text */}
                <View style={styles.helpContainer}>
                    <Feather name="help-circle" size={16} color="#6B7280" />
                    <Text style={styles.helpText}>
                        You can change these settings anytime. At least one notification channel must remain enabled.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

function NotificationToggle({ icon, label, value, onValueChange, subtitle }) {
    return (
        <View style={styles.toggleItem}>
            <View style={styles.toggleItemLeft}>
                <View style={styles.toggleIcon}>
                    <Feather name={icon} size={20} color="#2E5CFF" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.toggleLabel}>{label}</Text>
                    {subtitle && <Text style={styles.toggleSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                thumbColor={value ? '#2E5CFF' : '#F3F4F6'}
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    headerRight: {
        width: 40,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#F0F4FF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#93C5FD',
    },
    infoBannerText: {
        flex: 1,
        fontSize: 14,
        color: '#1A3FCC',
        marginLeft: 12,
        lineHeight: 20,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
        paddingLeft: 4,
    },
    sectionSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 12,
        paddingLeft: 4,
    },
    toggleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    toggleItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    toggleIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#F0F4FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    toggleLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    toggleSubtitle: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    helpContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    helpText: {
        flex: 1,
        fontSize: 13,
        color: '#6B7280',
        marginLeft: 8,
        lineHeight: 18,
    },
});