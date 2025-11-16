import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../context/AuthContext';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const [notifications, setNotifications] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [biometric, setBiometric] = useState(false);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#2E5CFF', '#1A3FCC']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <View style={styles.content}>
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
            icon="bell"
            label="Notifications"
            value={notifications}
            onValueChange={setNotifications}
          />
          <SettingsToggle
            icon="trending-up"
            label="Price Alerts"
            value={priceAlerts}
            onValueChange={setPriceAlerts}
          />
          <SettingsToggle
            icon="moon"
            label="Dark Mode"
            value={darkMode}
            onValueChange={setDarkMode}
            subtitle="Coming soon"
          />
          <SettingsToggle
            icon="fingerprint"
            label="Biometric Login"
            value={biometric}
            onValueChange={setBiometric}
          />
        </View>

        {/* Trading Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trading</Text>

          <SettingsItem
            icon="dollar-sign"
            label="Default Currency"
            value={user?.currency || 'INR'}
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
            icon="help-circle"
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
      </View>
    </ScrollView>
  );
}

function SettingsItem({ icon, label, value, onPress, hideChevron }) {
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
        <Text style={styles.settingsLabel}>{label}</Text>
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

function SettingsToggle({ icon, label, value, onValueChange, subtitle }) {
  return (
    <View style={styles.settingsItem}>
      <View style={styles.settingsItemLeft}>
        <View style={styles.settingsIcon}>
          <Feather name={icon} size={20} color="#2E5CFF" />
        </View>
        <View>
          <Text style={styles.settingsLabel}>{label}</Text>
          {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
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
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    padding: 20,
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
  settingsLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
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
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 8,
  },
  dangerButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#DC2626',
  },
});