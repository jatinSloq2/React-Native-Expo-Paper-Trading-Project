import { Feather, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import { useContext, useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { AuthContext } from '../../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { user, setUser } = useContext(AuthContext);

  // Local state synced with user.settings
  const [notifications, setNotifications] = useState(user?.settings?.notifications ?? true);
  const [priceAlerts, setPriceAlerts] = useState(user?.settings?.priceAlerts ?? false);
  const [darkMode, setDarkMode] = useState(user?.settings?.darkMode ?? false);
  const [biometric, setBiometric] = useState(user?.settings?.biometricLogin ?? false);
  const [hasBiometricHardware, setHasBiometricHardware] = useState(false);

  // Check if device supports biometric authentication
  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setHasBiometricHardware(compatible && enrolled);
  };

  // Update settings on backend
  const updateSetting = async (settingName, value) => {
    const token = await AsyncStorage.getItem("token");
    const apiKey = await AsyncStorage.getItem("api_key");
    try {
      const response = await axiosInstance.put(
        '/auth/settings',
        {
          [settingName]: value
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
          settings: {
            ...user.settings,
            [settingName]: value
          }
        });

        // Save to AsyncStorage for offline access
        await AsyncStorage.setItem('userSettings', JSON.stringify({
          ...user.settings,
          [settingName]: value
        }));
      }
    } catch (error) {
      console.error('Failed to update setting:', error);
      Alert.alert('Error', 'Failed to update settings. Please try again.');
      // Revert the change
      return false;
    }
    return true;
  };

  const handleNotificationsToggle = async (value) => {
    setNotifications(value);
    const success = await updateSetting('notifications', value);
    if (!success) setNotifications(!value);
  };

  const handlePriceAlertsToggle = async (value) => {
    if (value && !notifications) {
      Alert.alert(
        'Enable Notifications',
        'You need to enable notifications first to use price alerts.',
        [{ text: 'OK' }]
      );
      return;
    }
    setPriceAlerts(value);
    const success = await updateSetting('priceAlerts', value);
    if (!success) setPriceAlerts(!value);
  };

  const handleDarkModeToggle = async (value) => {
    Alert.alert(
      'Dark Mode',
      'Dark mode is coming soon! We\'re working on it.',
      [{ text: 'OK' }]
    );
    // For now, don't allow toggle
    // setDarkMode(value);
    // await updateSetting('darkMode', value);
  };

  const handleBiometricToggle = async (value) => {
    if (!hasBiometricHardware) {
      Alert.alert(
        'Biometric Not Available',
        'Your device does not support biometric authentication or you haven\'t set it up in your device settings.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (value) {
      // Enabling biometric - authenticate first
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable biometric login',
        fallbackLabel: 'Use passcode',
      });

      if (result.success) {
        setBiometric(true);
        const success = await updateSetting('biometricLogin', true);
        if (success) {
          await AsyncStorage.setItem('biometricEnabled', 'true');
          Alert.alert(
            'Success',
            'Biometric login has been enabled. You can now use fingerprint/face recognition to unlock the app.',
            [{ text: 'OK' }]
          );
        } else {
          setBiometric(false);
        }
      } else {
        Alert.alert(
          'Authentication Failed',
          'Could not verify your identity. Biometric login was not enabled.',
          [{ text: 'OK' }]
        );
      }
    } else {
      // Disabling biometric
      Alert.alert(
        'Disable Biometric Login',
        'Are you sure you want to disable biometric login?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: async () => {
              setBiometric(false);
              const success = await updateSetting('biometricLogin', false);
              if (success) {
                await AsyncStorage.removeItem('biometricEnabled');
                Alert.alert('Success', 'Biometric login has been disabled.');
              } else {
                setBiometric(true);
              }
            }
          }
        ]
      );
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
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <SettingsItem
            icon="user"
            label="Edit Profile"
            onPress={() => navigation.navigate('EditProfile')}
          />
          <SettingsItem
            icon="lock"
            label="Change Password"
            onPress={() => navigation.navigate('ChangePassword')}
          />
          <SettingsItem
            icon="shield"
            label="Privacy & Security"
            onPress={() => navigation.navigate('PrivacySecurity')}
          />
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>

          <SettingsToggle
            icon="notifications"
            label="Push Notifications"
            subtitle="Receive important updates and alerts"
            value={notifications}
            onValueChange={handleNotificationsToggle}
          />
          <SettingsToggle
            icon="trending-up"
            label="Price Alerts"
            subtitle="Get notified when stocks hit your targets"
            value={priceAlerts}
            onValueChange={handlePriceAlertsToggle}
            disabled={!notifications}
          />
          <SettingsToggle
            icon="dark-mode"
            label="Dark Mode"
            subtitle="Coming soon"
            value={darkMode}
            onValueChange={handleDarkModeToggle}
            disabled={true}
          />
          <SettingsToggle
            icon="fingerprint"
            label="Biometric Login"
            subtitle={hasBiometricHardware ? "Use fingerprint or face ID" : "Not available on this device"}
            value={biometric}
            onValueChange={handleBiometricToggle}
            disabled={!hasBiometricHardware}
          />
        </View>

        {/* Notification Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>

          <SettingsItem
            icon="mail"
            label="Manage Notifications"
            subtitle="Choose what you want to be notified about"
            onPress={() => navigation.navigate('NotificationPreferences')}
          />
        </View>

        {/* Trading Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trading</Text>

          <SettingsItem
            icon="dollar-sign"
            label="Default Currency"
            value={user?.currency}
            onPress={() => Alert.alert('Coming Soon', 'Currency selection will be available soon')}
          />
          <SettingsItem
            icon="refresh-cw"
            label="Auto-Refresh Interval"
            value="5 seconds"
            onPress={() => Alert.alert('Coming Soon', 'Refresh interval settings will be available soon')}
          />
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <SettingsItem
            icon="help-circle"
            label="Help Center"
            onPress={() => navigation.navigate('HelpCenter')}
          />
          <SettingsItem
            icon="life-buoy"
            label="See Your Tickets"
            onPress={() => navigation.navigate('YourTickets')}
          />
          <SettingsItem
            icon="message-circle"
            label="Contact Support"
            onPress={() => navigation.navigate('ContactSupport')}
          />
          <SettingsItem
            icon="file-text"
            label="Terms & Conditions"
            onPress={() => navigation.navigate('TermsConditions')}
          />
          <SettingsItem
            icon="shield"
            label="Privacy Policy"
            onPress={() => navigation.navigate('PrivacyPolicy')}
          />
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <SettingsItem
            icon="info"
            label="App Version"
            value="1.0.0"
            hideChevron
          />
          <SettingsItem
            icon="star"
            label="Rate Us"
            onPress={() => Alert.alert('Rate Us', 'Thank you for your support!')}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function SettingsItem({ icon, label, value, onPress, hideChevron, subtitle }) {
  return (
    <TouchableOpacity
      style={styles.settingsItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingsItemLeft}>
        <View style={styles.settingsIcon}>
          <Feather name={icon} size={20} color="#2E5CFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.settingsLabel}>{label}</Text>
          {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingsItemRight}>
        {value && <Text style={styles.settingsValue}>{value}</Text>}
        {!hideChevron && onPress && (
          <Feather name="chevron-right" size={20} color="#9CA3AF" />
        )}
      </View>
    </TouchableOpacity>
  );
}

function SettingsToggle({ icon, label, value, onValueChange, subtitle, disabled }) {
  return (
    <View style={[styles.settingsItem, disabled && styles.settingsItemDisabled]}>
      <View style={styles.settingsItemLeft}>
        <View style={[styles.settingsIcon, disabled && styles.settingsIconDisabled]}>
          <MaterialIcons name={icon} size={20} color={disabled ? "#9CA3AF" : "#2E5CFF"} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.settingsLabel, disabled && styles.settingsLabelDisabled]}>
            {label}
          </Text>
          {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    paddingLeft: 4,
  },
  settingsItem: {
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
  settingsItemDisabled: {
    opacity: 0.5,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingsIconDisabled: {
    backgroundColor: '#F5F7FA',
  },
  settingsLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  settingsLabelDisabled: {
    color: '#9CA3AF',
  },
  settingsSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsValue: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});