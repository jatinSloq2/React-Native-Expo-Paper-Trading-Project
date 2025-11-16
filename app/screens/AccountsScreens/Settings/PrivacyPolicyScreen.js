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

export default function PrivacyPolicyScreen() {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
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
            We are committed to protecting your personal information and privacy
          </Text>
        </View>

        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.paragraph}>
            Paper Bull ("we," "us," or "our") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
          </Text>
          <Text style={styles.paragraph}>
            By using Paper Bull, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our App.
          </Text>
        </View>

        {/* Information We Collect */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          
          <Text style={styles.subSectionTitle}>Personal Information</Text>
          <Text style={styles.paragraph}>
            When you create an account, we collect:
          </Text>
          <BulletPoint text="Full name" />
          <BulletPoint text="Email address" />
          <BulletPoint text="Phone number (optional)" />
          <BulletPoint text="Country of residence" />
          <BulletPoint text="Password (encrypted)" />

          <Text style={styles.subSectionTitle}>Trading Data</Text>
          <Text style={styles.paragraph}>
            We collect information about your virtual trading activities:
          </Text>
          <BulletPoint text="Virtual portfolio holdings and transactions" />
          <BulletPoint text="Trading history and patterns" />
          <BulletPoint text="Watchlist preferences" />
          <BulletPoint text="Virtual account balance" />

          <Text style={styles.subSectionTitle}>Device Information</Text>
          <BulletPoint text="Device type and model" />
          <BulletPoint text="Operating system version" />
          <BulletPoint text="Unique device identifiers" />
          <BulletPoint text="IP address and location data" />
          <BulletPoint text="App usage statistics" />
        </View>

        {/* How We Use Your Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use the collected information to:
          </Text>
          <BulletPoint text="Provide and maintain our trading simulation service" />
          <BulletPoint text="Create and manage your account" />
          <BulletPoint text="Process your virtual transactions" />
          <BulletPoint text="Send important notifications about your account" />
          <BulletPoint text="Improve and personalize your experience" />
          <BulletPoint text="Analyze app usage and performance" />
          <BulletPoint text="Prevent fraud and ensure security" />
          <BulletPoint text="Comply with legal obligations" />
          <BulletPoint text="Send educational content and updates (with your consent)" />
        </View>

        {/* Data Sharing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. How We Share Your Information</Text>
          <View style={styles.importantBox}>
            <Feather name="info" size={18} color="#2E5CFF" />
            <Text style={styles.importantText}>
              We never sell your personal information to third parties
            </Text>
          </View>
          <Text style={styles.paragraph}>
            We may share your information with:
          </Text>
          
          <Text style={styles.subSectionTitle}>Service Providers</Text>
          <BulletPoint text="Cloud hosting services (AWS, Google Cloud)" />
          <BulletPoint text="Analytics providers (Firebase Analytics)" />
          <BulletPoint text="Email service providers" />
          <BulletPoint text="Market data providers" />
          <Text style={styles.paragraph}>
            All service providers are bound by confidentiality agreements and can only use your data to perform services for us.
          </Text>

          <Text style={styles.subSectionTitle}>Legal Requirements</Text>
          <Text style={styles.paragraph}>
            We may disclose your information if required by law or in response to:
          </Text>
          <BulletPoint text="Court orders or legal processes" />
          <BulletPoint text="Requests from government authorities" />
          <BulletPoint text="Protection of our rights or safety" />
        </View>

        {/* Data Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement industry-standard security measures to protect your data:
          </Text>
          <BulletPoint text="End-to-end encryption for sensitive data" />
          <BulletPoint text="Secure HTTPS connections" />
          <BulletPoint text="Regular security audits and penetration testing" />
          <BulletPoint text="Encrypted password storage (bcrypt hashing)" />
          <BulletPoint text="Two-factor authentication options" />
          <BulletPoint text="Limited employee access with strict NDAs" />
          <BulletPoint text="Regular backups with encryption" />
          <Text style={styles.paragraph}>
            However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
          </Text>
        </View>

        {/* Data Retention */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain your personal information for as long as necessary to:
          </Text>
          <BulletPoint text="Provide our services to you" />
          <BulletPoint text="Comply with legal obligations" />
          <BulletPoint text="Resolve disputes" />
          <BulletPoint text="Enforce our agreements" />
          <Text style={styles.paragraph}>
            When you delete your account, we will delete or anonymize your personal data within 30 days, except where we are legally required to retain it.
          </Text>
        </View>

        {/* Your Rights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Your Privacy Rights</Text>
          <Text style={styles.paragraph}>
            You have the right to:
          </Text>
          <BulletPoint text="Access your personal data" />
          <BulletPoint text="Correct inaccurate data" />
          <BulletPoint text="Request deletion of your data" />
          <BulletPoint text="Export your data (data portability)" />
          <BulletPoint text="Opt-out of marketing communications" />
          <BulletPoint text="Withdraw consent at any time" />
          <BulletPoint text="Lodge a complaint with a supervisory authority" />
          <Text style={styles.paragraph}>
            To exercise these rights, contact us at privacy@paperbull.com
          </Text>
        </View>

        {/* Cookies and Tracking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Cookies and Tracking Technologies</Text>
          <Text style={styles.paragraph}>
            We use cookies and similar tracking technologies to:
          </Text>
          <BulletPoint text="Remember your preferences" />
          <BulletPoint text="Analyze app usage patterns" />
          <BulletPoint text="Improve app performance" />
          <BulletPoint text="Provide personalized content" />
          <Text style={styles.paragraph}>
            You can manage cookie preferences in your device settings.
          </Text>
        </View>

        {/* Children's Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Children's Privacy</Text>
          <Text style={styles.paragraph}>
            Our App is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
          </Text>
        </View>

        {/* International Data Transfers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. International Data Transfers</Text>
          <Text style={styles.paragraph}>
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers, including:
          </Text>
          <BulletPoint text="Standard contractual clauses" />
          <BulletPoint text="Privacy Shield certification (where applicable)" />
          <BulletPoint text="Adequate data protection laws" />
        </View>

        {/* Changes to Privacy Policy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Changes to This Privacy Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by:
          </Text>
          <BulletPoint text="Posting the new policy on this page" />
          <BulletPoint text="Sending an email notification" />
          <BulletPoint text="In-app notification" />
          <Text style={styles.paragraph}>
            The "Last Updated" date at the bottom of this policy indicates when it was last revised. Your continued use after changes constitutes acceptance of the updated policy.
          </Text>
        </View>

        {/* Contact */}
        <View style={styles.contactSection}>
          <View style={styles.contactIcon}>
            <Feather name="mail" size={24} color="#2E5CFF" />
          </View>
          <Text style={styles.contactTitle}>Questions About Privacy?</Text>
          <Text style={styles.contactText}>
            If you have questions or concerns about this Privacy Policy or our data practices, please contact our Data Protection Officer:
          </Text>
          <Text style={styles.contactEmail}>privacy@paperbull.com</Text>
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>
              Paper Bull{'\n'}
              Privacy Team{'\n'}
              Mumbai, India
            </Text>
          </View>
        </View>

        {/* Last Updated */}
        <View style={styles.updateInfo}>
          <Feather name="calendar" size={14} color="#9CA3AF" />
          <Text style={styles.updateText}>Last updated: November 16, 2025</Text>
        </View>

        <View style={styles.acceptanceBox}>
          <Feather name="shield" size={20} color="#10B981" />
          <Text style={styles.acceptanceText}>
            Your privacy is important to us. We are committed to maintaining the confidentiality and security of your personal information.
          </Text>
        </View>
      </ScrollView>
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
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  subSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingLeft: 8,
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
    lineHeight: 22,
  },
  importantBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  importantText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#1E40AF',
    lineHeight: 20,
  },
  contactSection: {
    backgroundColor: '#EFF6FF',
    padding: 24,
    margin: 20,
    marginTop: 12,
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
    marginBottom: 12,
    lineHeight: 20,
  },
  contactEmail: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E5CFF',
    marginBottom: 16,
  },
  addressContainer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
  },
  addressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
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
  acceptanceBox: {
    flexDirection: 'row',
    backgroundColor: '#D1FAE5',
    padding: 16,
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  acceptanceText: {
    flex: 1,
    fontSize: 13,
    color: '#065F46',
    lineHeight: 20,
  },
});