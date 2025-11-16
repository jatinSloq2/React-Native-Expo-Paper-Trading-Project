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

export default function TermsConditionsScreen() {
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
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Feather name="file-text" size={32} color="#2E5CFF" />
          </View>
          <Text style={styles.heroTitle}>Terms of Service</Text>
          <Text style={styles.heroSubtitle}>
            Please read these terms carefully before using Paper Bull
          </Text>
        </View>

        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Agreement to Terms</Text>
          <Text style={styles.paragraph}>
            By accessing and using Paper Bull ("the App"), you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the App.
          </Text>
          <Text style={styles.paragraph}>
            These terms apply to all visitors, users, and others who access or use the App. We reserve the right to modify these terms at any time, and such modifications will be effective immediately upon posting.
          </Text>
        </View>

        {/* Service Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Service Description</Text>
          <Text style={styles.paragraph}>
            Paper Bull is a <Text style={styles.highlight}>virtual trading platform</Text> that provides:
          </Text>
          <BulletPoint text="Simulated stock market trading environment" />
          <BulletPoint text="Real-time market data for educational purposes" />
          <BulletPoint text="Virtual portfolio management tools" />
          <BulletPoint text="Educational resources about trading" />
          <Text style={styles.paragraph}>
            All trades are executed with <Text style={styles.highlight}>virtual money only</Text>. No real financial transactions occur within the App.
          </Text>
        </View>

        {/* User Accounts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Accounts</Text>
          <Text style={styles.paragraph}>
            When you create an account with us, you must:
          </Text>
          <BulletPoint text="Provide accurate and complete information" />
          <BulletPoint text="Maintain the security of your account credentials" />
          <BulletPoint text="Be at least 13 years of age" />
          <BulletPoint text="Notify us immediately of any unauthorized use" />
          <Text style={styles.paragraph}>
            You are responsible for all activities that occur under your account. We reserve the right to suspend or terminate accounts that violate these terms.
          </Text>
        </View>

        {/* Acceptable Use */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Acceptable Use Policy</Text>
          <Text style={styles.paragraph}>
            You agree NOT to use the App to:
          </Text>
          <BulletPoint text="Engage in any illegal or unauthorized activities" />
          <BulletPoint text="Violate any applicable laws or regulations" />
          <BulletPoint text="Impersonate any person or entity" />
          <BulletPoint text="Transmit viruses or malicious code" />
          <BulletPoint text="Interfere with the App's proper functioning" />
          <BulletPoint text="Collect user data without authorization" />
          <BulletPoint text="Use the App for commercial purposes without permission" />
        </View>

        {/* Virtual Trading */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Virtual Trading Disclaimer</Text>
          <View style={styles.warningBox}>
            <Feather name="alert-triangle" size={20} color="#F59E0B" />
            <Text style={styles.warningText}>
              Paper Bull is for educational and practice purposes only
            </Text>
          </View>
          <Text style={styles.paragraph}>
            You acknowledge that:
          </Text>
          <BulletPoint text="All funds in the App are virtual and have no real monetary value" />
          <BulletPoint text="Trading results do not guarantee real-world performance" />
          <BulletPoint text="Market data may have delays or inaccuracies" />
          <BulletPoint text="The App does not provide financial advice" />
          <BulletPoint text="Past performance does not indicate future results" />
        </View>

        {/* Intellectual Property */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Intellectual Property Rights</Text>
          <Text style={styles.paragraph}>
            The App and its original content, features, and functionality are owned by Paper Bull and are protected by international copyright, trademark, and other intellectual property laws.
          </Text>
          <Text style={styles.paragraph}>
            You may not reproduce, distribute, modify, or create derivative works without our express written permission.
          </Text>
        </View>

        {/* Limitation of Liability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            To the maximum extent permitted by law, Paper Bull shall not be liable for:
          </Text>
          <BulletPoint text="Any indirect, incidental, or consequential damages" />
          <BulletPoint text="Loss of profits or data" />
          <BulletPoint text="Service interruptions or errors" />
          <BulletPoint text="Actions taken based on information from the App" />
          <Text style={styles.paragraph}>
            Your use of the App is at your own risk. The App is provided "as is" without warranties of any kind.
          </Text>
        </View>

        {/* Termination */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Termination</Text>
          <Text style={styles.paragraph}>
            We may terminate or suspend your account immediately, without prior notice, for:
          </Text>
          <BulletPoint text="Breach of these Terms" />
          <BulletPoint text="Fraudulent or illegal activities" />
          <BulletPoint text="Extended periods of inactivity" />
          <BulletPoint text="At our sole discretion" />
          <Text style={styles.paragraph}>
            Upon termination, your right to use the App will immediately cease, and all data may be deleted.
          </Text>
        </View>

        {/* Governing Law */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Governing Law</Text>
          <Text style={styles.paragraph}>
            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
          </Text>
          <Text style={styles.paragraph}>
            Any disputes arising from these Terms or use of the App shall be subject to the exclusive jurisdiction of the courts in Mumbai, India.
          </Text>
        </View>

        {/* Changes to Terms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We reserve the right to modify or replace these Terms at any time. We will provide notice of any material changes by:
          </Text>
          <BulletPoint text="Posting the new Terms on this page" />
          <BulletPoint text="Sending an email notification" />
          <BulletPoint text="In-app notification" />
          <Text style={styles.paragraph}>
            Your continued use of the App after such modifications constitutes acceptance of the updated Terms.
          </Text>
        </View>

        {/* Contact */}
        <View style={styles.contactSection}>
          <View style={styles.contactIcon}>
            <Feather name="mail" size={24} color="#2E5CFF" />
          </View>
          <Text style={styles.contactTitle}>Questions About These Terms?</Text>
          <Text style={styles.contactText}>
            If you have any questions about these Terms and Conditions, please contact us at:
          </Text>
          <Text style={styles.contactEmail}>legal@paperbull.com</Text>
        </View>

        {/* Last Updated */}
        <View style={styles.updateInfo}>
          <Feather name="calendar" size={14} color="#9CA3AF" />
          <Text style={styles.updateText}>Last updated: November 16, 2025</Text>
        </View>

        <View style={styles.acceptanceBox}>
          <Feather name="check-circle" size={20} color="#10B981" />
          <Text style={styles.acceptanceText}>
            By using Paper Bull, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
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
  paragraph: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 12,
  },
  highlight: {
    fontWeight: '700',
    color: '#2E5CFF',
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
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
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
    marginBottom: 8,
    lineHeight: 20,
  },
  contactEmail: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E5CFF',
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