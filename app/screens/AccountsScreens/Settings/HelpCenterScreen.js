import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function HelpCenterScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      category: 'Getting Started',
      question: 'What is Paper Bull?',
      answer: 'Paper Bull is a virtual trading platform that allows you to practice stock trading with virtual money in real market conditions. It\'s perfect for beginners to learn trading without any financial risk.'
    },
    {
      id: 2,
      category: 'Getting Started',
      question: 'How do I create an account?',
      answer: 'Tap on the "Account" tab and click "Create Account". Fill in your details including name, email, and password. You\'ll receive a verification email to activate your account.'
    },
    {
      id: 3,
      category: 'Account',
      question: 'How much virtual money do I start with?',
      answer: 'New users start with ₹1,00,000 in virtual money. You can add or deduct funds from your account settings to simulate different trading scenarios.'
    },
    {
      id: 4,
      category: 'Account',
      question: 'Can I reset my virtual balance?',
      answer: 'Yes! Go to Settings > Danger Zone > Reset Virtual Balance. This will reset your balance to the initial amount and clear all your trading history.'
    },
    {
      id: 5,
      category: 'Trading',
      question: 'How do I place a trade?',
      answer: 'Navigate to Stocks or F&O tab, search for the stock you want to trade, tap on it to view details, and click "Buy" or "Sell". Enter the quantity and confirm your order.'
    },
    {
      id: 6,
      category: 'Trading',
      question: 'Are the market prices real?',
      answer: 'Yes! We provide real-time market data from actual stock exchanges. Your trades are simulated but the prices and market movements are real.'
    },
    {
      id: 7,
      category: 'Trading',
      question: 'What are the trading hours?',
      answer: 'Trading follows actual market hours: Monday to Friday, 9:15 AM to 3:30 PM IST. Pre-market opens at 9:00 AM and post-market closes at 4:00 PM.'
    },
    {
      id: 8,
      category: 'Portfolio',
      question: 'How do I track my portfolio?',
      answer: 'Go to the Portfolio tab to see all your holdings, their current value, profit/loss, and overall portfolio performance. You can view detailed analytics and charts.'
    },
    {
      id: 9,
      category: 'Portfolio',
      question: 'What is the difference between realized and unrealized P&L?',
      answer: 'Unrealized P&L is the profit/loss on holdings you still own. Realized P&L is the actual profit/loss from trades you\'ve closed by selling your positions.'
    },
    {
      id: 10,
      category: 'Features',
      question: 'Can I set price alerts?',
      answer: 'Yes! In Market Watch, tap on any stock and select "Set Alert". You\'ll be notified when the stock reaches your target price.'
    },
    {
      id: 11,
      category: 'Features',
      question: 'Is there a learning section?',
      answer: 'Absolutely! Check out the Learning Hub from your Account screen. We offer courses on trading basics, technical analysis, F&O strategies, and more.'
    },
    {
      id: 12,
      category: 'Security',
      question: 'Is my data safe?',
      answer: 'Yes! We use bank-level encryption to protect your data. Your personal information is never shared with third parties. Learn more in Privacy & Security settings.'
    },
    {
      id: 13,
      category: 'Troubleshooting',
      question: 'Why can\'t I place an order?',
      answer: 'Common reasons: insufficient virtual balance, market is closed, or you\'ve reached position limits. Check your balance and ensure trading hours are active.'
    },
    {
      id: 14,
      category: 'Troubleshooting',
      question: 'App is not showing live prices',
      answer: 'Check your internet connection. If the issue persists, try refreshing by pulling down on the screen or restarting the app.'
    }
  ];

  const categories = ['All', ...new Set(faqs.map(faq => faq.category))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#2E5CFF', '#1A3FCC']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help Center</Text>
          <View style={{ width: 40 }} />
        </View>

        <Text style={styles.headerSubtitle}>
          Find answers to common questions
        </Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help..."
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={20} color="rgba(255, 255, 255, 0.8)" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category && styles.categoryChipTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Quick Help Cards */}
        <View style={styles.quickHelpSection}>
          <Text style={styles.sectionTitle}>Quick Help</Text>
          <View style={styles.quickHelpGrid}>
            <QuickHelpCard
              icon="book-open"
              title="User Guide"
              description="Complete guide to using Paper Bull"
              onPress={() => {}}
            />
            <QuickHelpCard
              icon="video"
              title="Video Tutorials"
              description="Learn through video lessons"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* FAQs */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>
            Frequently Asked Questions ({filteredFaqs.length})
          </Text>
          
          {filteredFaqs.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isExpanded={expandedFaq === faq.id}
              onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
            />
          ))}

          {filteredFaqs.length === 0 && (
            <View style={styles.noResults}>
              <Feather name="search" size={48} color="#9CA3AF" />
              <Text style={styles.noResultsText}>No results found</Text>
              <Text style={styles.noResultsSubtext}>
                Try different keywords or browse categories
              </Text>
            </View>
          )}
        </View>

        {/* Still Need Help */}
        <View style={styles.contactCard}>
          <View style={styles.contactIcon}>
            <Feather name="message-circle" size={28} color="#2E5CFF" />
          </View>
          <Text style={styles.contactTitle}>Still need help?</Text>
          <Text style={styles.contactDescription}>
            Can't find what you're looking for? Our support team is here to help!
          </Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => navigation.navigate('ContactSupport')}
          >
            <Text style={styles.contactButtonText}>Contact Support</Text>
            <Feather name="arrow-right" size={18} color="#2E5CFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function QuickHelpCard({ icon, title, description, onPress }) {
  return (
    <TouchableOpacity style={styles.quickHelpCard} onPress={onPress}>
      <View style={styles.quickHelpIcon}>
        <Feather name={icon} size={24} color="#2E5CFF" />
      </View>
      <Text style={styles.quickHelpTitle}>{title}</Text>
      <Text style={styles.quickHelpDescription}>{description}</Text>
    </TouchableOpacity>
  );
}

function FAQItem({ faq, isExpanded, onPress }) {
  return (
    <TouchableOpacity
      style={styles.faqItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.faqHeader}>
        <View style={styles.faqQuestion}>
          <View style={styles.faqCategoryBadge}>
            <Text style={styles.faqCategoryText}>{faq.category}</Text>
          </View>
          <Text style={styles.faqQuestionText}>{faq.question}</Text>
        </View>
        <Feather
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#6B7280"
        />
      </View>
      {isExpanded && (
        <Text style={styles.faqAnswer}>{faq.answer}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  categoriesContainer: {
    marginTop: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipActive: {
    backgroundColor: '#2E5CFF',
    borderColor: '#2E5CFF',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  quickHelpSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  quickHelpGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickHelpCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickHelpIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickHelpTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  quickHelpDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  faqSection: {
    padding: 20,
    paddingTop: 0,
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  faqQuestion: {
    flex: 1,
    marginRight: 12,
  },
  faqCategoryBadge: {
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  faqCategoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2E5CFF',
  },
  faqQuestionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 22,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  noResults: {
    alignItems: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 0,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  contactDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E5CFF',
  },
});