import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function PrivacySecurityScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
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
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Feather name="shield" size={32} color="#2E5CFF" />
          </View>
          <Text style={styles.heroTitle}>Your Privacy Matters</Text>
          <Text style={styles.heroSubtitle}>
            We take your privacy and security seriously. Learn how we protect your data.
          </Text>
        </View>

        {/* Data Collection Section */}
        <Section
          icon="database"
          title="Data We Collect"
          description="To provide you with the best trading simulation experience, we collect:"
        >
          <BulletPoint text="Account information (name, email, phone)" />
          <BulletPoint text="Trading activity and portfolio data" />
          <BulletPoint text="Device information and app usage analytics" />
          <BulletPoint text="Virtual transaction history" />
        </Section>

        {/* Data Usage Section */}
        <Section
          icon="activity"
          title="How We Use Your Data"
          description="Your data helps us improve your experience:"
        >
          <BulletPoint text="Provide accurate trading simulations" />
          <BulletPoint text="Track your portfolio performance" />
          <BulletPoint text="Send important account notifications" />
          <BulletPoint text="Improve app features and user experience" />
          <BulletPoint text="Prevent fraud and ensure account security" />
        </Section>

        {/* Data Protection Section */}
        <Section
          icon="lock"
          title="Data Protection"
          description="We implement industry-standard security measures:"
        >
          <BulletPoint text="End-to-end encryption for sensitive data" />
          <BulletPoint text="Secure servers with regular security audits" />
          <BulletPoint text="Two-factor authentication options" />
          <BulletPoint text="Regular security updates and patches" />
          <BulletPoint text="Limited employee access to user data" />
        </Section>

        {/* Data Sharing Section */}
        <Section
          icon="users"
          title="Data Sharing"
          description="We never sell your personal information. Limited sharing includes:"
        >
          <BulletPoint text="Market data providers (for real-time prices)" />
          <BulletPoint text="Analytics services (anonymized data only)" />
          <BulletPoint text="Legal compliance when required by law" />
          <BulletPoint text="Service providers under strict NDAs" />
        </Section>

        {/* Your Rights Section */}
        <Section
          icon="check-circle"
          title="Your Rights"
          description="You have control over your data:"
        >
          <BulletPoint text="Access your personal data at any time" />
          <BulletPoint text="Request data deletion" />
          <BulletPoint text="Export your trading history" />
          <BulletPoint text="Opt-out of marketing communications" />
          <BulletPoint text="Update or correct your information" />
        </Section>

        {/* Security Tips Section */}
        <Section
          icon="alert-circle"
          title="Security Best Practices"
          description="Protect your account with these tips:"
        >
          <BulletPoint text="Use a strong, unique password" />
          <BulletPoint text="Enable biometric authentication" />
          <BulletPoint text="Never share your password" />
          <BulletPoint text="Review account activity regularly" />
          <BulletPoint text="Log out on shared devices" />
          <BulletPoint text="Keep your app updated" />
        </Section>

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <View style={styles.contactIcon}>
            <Feather name="mail" size={24} color="#2E5CFF" />
          </View>
          <Text style={styles.contactTitle}>Questions About Privacy?</Text>
          <Text style={styles.contactText}>
            Contact our privacy team at privacy@paperbull.com for any concerns or inquiries.
          </Text>
        </View>

        {/* Last Updated */}
        <View style={styles.updateInfo}>
          <Feather name="calendar" size={14} color="#9CA3AF" />
          <Text style={styles.updateText}>Last updated: November 16, 2025</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Section({ icon, title, description, children }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <Feather name={icon} size={20} color="#2E5CFF" />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.sectionDescription}>{description}</Text>
      <View style={styles.bulletList}>
        {children}
      </View>
    </View>
  );
}

function BulletPoint({ text }) {
  return (
    <View style={styles.bulletPoint}>
      <View style={styles.bullet} />
      <Text style={styles.bulletText}>{text}</Text>
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
  content: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  bulletList: {
    gap: 12,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E5CFF',
    marginTop: 7,
    marginRight: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  contactSection: {
    backgroundColor: '#EFF6FF',
    padding: 24,
    margin: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  contactIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 13,
    color: '#3B82F6',
    textAlign: 'center',
    lineHeight: 20,
  },
  updateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 6,
  },
  updateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});