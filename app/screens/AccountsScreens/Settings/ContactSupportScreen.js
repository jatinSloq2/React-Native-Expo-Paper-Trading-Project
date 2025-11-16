import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import axiosInstance from '../../../api/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ContactSupportScreen() {
  const navigation = useNavigation();

  const [selectedIssue, setSelectedIssue] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const issueTypes = [
    { id: 'technical', label: 'Technical Issue', icon: 'alert-circle' },
    { id: 'account', label: 'Account Problem', icon: 'user' },
    { id: 'trading', label: 'Trading Issue', icon: 'trending-up' },
    { id: 'billing', label: 'Billing Query', icon: 'credit-card' },
    { id: 'feedback', label: 'Feedback', icon: 'message-square' },
    { id: 'other', label: 'Other', icon: 'help-circle' },
  ];

  const handleSubmit = async () => {
    if (!selectedIssue) return Alert.alert('Error', 'Please select an issue type');
    if (!subject.trim()) return Alert.alert('Error', 'Please enter a subject');
    if (!message.trim()) return Alert.alert('Error', 'Please describe your issue');
    if (!email.trim()) return Alert.alert('Error', 'Please enter your email');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Alert.alert('Error', 'Please enter a valid email');
    }
    const token = await AsyncStorage.getItem("token");
    setLoading(true);

    try {
      await axiosInstance.post(
        "/support/create",
        {
          email,
          issueType: selectedIssue,
          subject,
          message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLoading(false);

      Alert.alert(
        "Support Ticket Submitted",
        "Thank you for contacting us! Our team will get back to you shortly.",
        [
          {
            text: "OK",
            onPress: () => {
              setSelectedIssue("");
              setSubject("");
              setMessage("");
              setEmail("");
              navigation.goBack();
            },
          },
        ]
      );
    } catch (err) {
      setLoading(false);
      console.log(err)
      Alert.alert("Error", err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
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
        <Text style={styles.headerTitle}>Contact Support</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <View style={styles.infoBannerIcon}>
            <Feather name="clock" size={24} color="#10B981" />
          </View>
          <View style={styles.infoBannerContent}>
            <Text style={styles.infoBannerTitle}>24-Hour Response Time</Text>
            <Text style={styles.infoBannerText}>
              We typically respond within 24 hours during business days
            </Text>
          </View>
        </View>

        {/* Issue Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What can we help you with? *</Text>
          <View style={styles.issueGrid}>
            {issueTypes.map((issue) => (
              <TouchableOpacity
                key={issue.id}
                style={[
                  styles.issueCard,
                  selectedIssue === issue.id && styles.issueCardActive
                ]}
                onPress={() => setSelectedIssue(issue.id)}
              >
                <Feather
                  name={issue.icon}
                  size={24}
                  color={selectedIssue === issue.id ? '#2E5CFF' : '#6B7280'}
                />
                <Text style={[
                  styles.issueLabel,
                  selectedIssue === issue.id && styles.issueLabelActive
                ]}>
                  {issue.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="your.email@example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Subject *</Text>
            <View style={styles.inputContainer}>
              <Feather name="file-text" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={subject}
                onChangeText={setSubject}
                placeholder="Brief description of your issue"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Message *</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={message}
                onChangeText={setMessage}
                placeholder="Please describe your issue in detail..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
            <Text style={styles.charCount}>{message.length} characters</Text>
          </View>
        </View>

        {/* Quick Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Tips for faster resolution:</Text>
          <TipItem text="Include screenshots if reporting a visual issue" />
          <TipItem text="Mention your device model and OS version" />
          <TipItem text="Describe the steps to reproduce the problem" />
          <TipItem text="Include any error messages you received" />
        </View>

        {/* Alternative Contact Methods */}
        <View style={styles.alternativeSection}>
          <Text style={styles.alternativeTitle}>Other Ways to Reach Us</Text>

          <TouchableOpacity style={styles.alternativeCard}>
            <View style={styles.alternativeIcon}>
              <Feather name="mail" size={20} color="#2E5CFF" />
            </View>
            <View style={styles.alternativeContent}>
              <Text style={styles.alternativeLabel}>Email Us</Text>
              <Text style={styles.alternativeValue}>support@paperbull.com</Text>
            </View>
            <Feather name="external-link" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.alternativeCard}>
            <View style={styles.alternativeIcon}>
              <Feather name="message-circle" size={20} color="#2E5CFF" />
            </View>
            <View style={styles.alternativeContent}>
              <Text style={styles.alternativeLabel}>Live Chat</Text>
              <Text style={styles.alternativeValue}>Mon-Fri, 9 AM - 6 PM IST</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#2E5CFF', '#1A3FCC']}
            style={styles.submitButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Feather name="send" size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Submit Request</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function TipItem({ text }) {
  return (
    <View style={styles.tipItem}>
      <View style={styles.tipBullet} />
      <Text style={styles.tipText}>{text}</Text>
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
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#D1FAE5',
    margin: 20,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  infoBannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoBannerContent: {
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 4,
  },
  infoBannerText: {
    fontSize: 12,
    color: '#059669',
    lineHeight: 18,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  issueGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  issueCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  issueCardActive: {
    borderColor: '#2E5CFF',
    backgroundColor: '#F0F4FF',
  },
  issueLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  issueLabelActive: {
    color: '#2E5CFF',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 15,
    color: '#1A1A1A',
  },
  textArea: {
    height: 120,
    paddingTop: 8,
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'right',
  },
  tipsSection: {
    backgroundColor: '#FFFBEB',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
    marginTop: 6,
    marginRight: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#78350F',
    lineHeight: 20,
  },
  alternativeSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  alternativeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  alternativeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  alternativeIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alternativeContent: {
    flex: 1,
  },
  alternativeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  alternativeValue: {
    fontSize: 12,
    color: '#6B7280',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    flexDirection: 'row',
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});