import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function HelpCenterScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showUserGuide, setShowUserGuide] = useState(false);

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
              onPress={() => setShowUserGuide(true)}
            />
            <QuickHelpCard
              icon="video"
              title="Video Tutorials"
              description="We're improving your experience"
              comingSoon={true}
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

      {/* User Guide Modal */}
      <UserGuideModal 
        visible={showUserGuide} 
        onClose={() => setShowUserGuide(false)} 
      />
    </View>
  );
}

function QuickHelpCard({ icon, title, description, comingSoon, onPress }) {
  return (
    <TouchableOpacity 
      style={styles.quickHelpCard} 
      onPress={onPress}
      disabled={comingSoon}
    >
      <View style={styles.quickHelpIcon}>
        <Feather name={icon} size={24} color="#2E5CFF" />
      </View>
      <Text style={styles.quickHelpTitle}>{title}</Text>
      <Text style={styles.quickHelpDescription}>{description}</Text>
      {comingSoon && (
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>Coming Soon</Text>
        </View>
      )}
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

function UserGuideModal({ visible, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  const guideSteps = [
    {
      title: "Welcome to Paper Bull! 🎉",
      icon: "smile",
      content: "Learn how to get started with virtual trading and master the platform step by step.",
      color: "#2E5CFF"
    },
    {
      title: "Step 1: Registration",
      icon: "user-plus",
      content: "• Tap on 'Account' tab at the bottom\n• Click 'Create Account' or 'Register'\n• Fill in your details:\n  - Full Name\n  - Email Address\n  - Strong Password\n• Verify your email\n• Login with your credentials\n\nYou'll start with ₹1,00,000 virtual money!",
      color: "#10B981"
    },
    {
      title: "Step 2: Adding Funds",
      icon: "plus-circle",
      content: "To add more virtual funds:\n\n• Go to Account Tab\n• Tap on your balance card\n• Select 'Add Funds'\n• Enter the amount you want to add\n• Confirm the transaction\n\nNote: This is virtual money for practice. You can add as much as you need for your trading simulations!",
      color: "#8B5CF6"
    },
    {
      title: "Step 3: Deducting Funds",
      icon: "minus-circle",
      content: "To deduct virtual funds:\n\n• Go to Account Tab\n• Tap on your balance card\n• Select 'Deduct Funds'\n• Enter the amount to deduct\n• Confirm the transaction\n\nUseful for simulating different capital scenarios or challenging yourself with limited funds.",
      color: "#F59E0B"
    },
    {
      title: "Step 4: Exploring Stocks",
      icon: "trending-up",
      content: "• Navigate to 'Stocks' tab\n• Browse trending stocks or search\n• Tap on any stock to view:\n  - Real-time price\n  - Price charts\n  - Company details\n  - News & updates\n• Use filters to find stocks by sector",
      color: "#06B6D4"
    },
    {
      title: "Step 5: Placing Your First Trade",
      icon: "shopping-cart",
      content: "To buy stocks:\n\n• Select a stock from the list\n• Tap 'Buy' button\n• Enter quantity to purchase\n• Review order details\n• Confirm your order\n\nTo sell:\n• Go to Portfolio tab\n• Select your holding\n• Tap 'Sell' and enter quantity\n• Confirm the sale",
      color: "#EF4444"
    },
    {
      title: "Step 6: Managing Portfolio",
      icon: "briefcase",
      content: "Your Portfolio shows:\n\n• Current holdings & quantities\n• Investment value\n• Current market value\n• Profit/Loss (P&L)\n• Total returns percentage\n\nTrack performance with:\n• Daily P&L charts\n• Sector allocation\n• Top gainers/losers",
      color: "#EC4899"
    },
    {
      title: "Step 7: Market Watch",
      icon: "eye",
      content: "• Add stocks to watchlist\n• Set price alerts\n• Monitor multiple stocks\n• Quick buy/sell access\n• View live price updates\n\nTip: Build watchlists for different sectors to stay organized!",
      color: "#14B8A6"
    },
    {
      title: "Step 8: F&O Trading",
      icon: "bar-chart-2",
      content: "Futures & Options:\n\n• Navigate to F&O tab\n• Choose Futures or Options\n• Select underlying stock\n• Pick expiry date\n• For Options: Select Call/Put\n• Choose strike price\n• Enter quantity (lots)\n• Place your order\n\nWarning: F&O requires understanding of derivatives!",
      color: "#F97316"
    },
    {
      title: "Step 9: Learning Hub",
      icon: "book",
      content: "Improve your trading skills:\n\n• Trading basics\n• Technical analysis\n• Fundamental analysis\n• Risk management\n• F&O strategies\n• Market psychology\n\nAccess from Account > Learning Hub",
      color: "#6366F1"
    },
    {
      title: "Step 10: Settings & Security",
      icon: "settings",
      content: "Manage your account:\n\n• Edit profile information\n• Change password\n• Privacy settings\n• Enable notifications\n• Reset virtual balance\n• Review terms & policies\n\nAccess: Account > Settings",
      color: "#64748B"
    },
    {
      title: "You're All Set! 🚀",
      icon: "check-circle",
      content: "You now know how to:\n\n✓ Register and manage funds\n✓ Browse and trade stocks\n✓ Track your portfolio\n✓ Use F&O features\n✓ Learn and improve\n\nStart trading and practice risk-free!\n\nRemember: This is a simulation. Practice strategies before real trading.",
      color: "#10B981"
    }
  ];

  const currentGuide = guideSteps[currentStep];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Complete User Guide</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentStep + 1) / guideSteps.length) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              Step {currentStep + 1} of {guideSteps.length}
            </Text>
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.guideContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.guideIconContainer, { backgroundColor: currentGuide.color + '15' }]}>
              <Feather name={currentGuide.icon} size={48} color={currentGuide.color} />
            </View>
            
            <Text style={styles.guideTitle}>{currentGuide.title}</Text>
            <Text style={styles.guideText}>{currentGuide.content}</Text>
          </ScrollView>

          {/* Navigation Buttons */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
              onPress={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <Feather name="arrow-left" size={20} color={currentStep === 0 ? "#9CA3AF" : "#2E5CFF"} />
              <Text style={[styles.navButtonText, currentStep === 0 && styles.navButtonTextDisabled]}>
                Previous
              </Text>
            </TouchableOpacity>

            {currentStep === guideSteps.length - 1 ? (
              <TouchableOpacity
                style={styles.finishButton}
                onPress={onClose}
              >
                <Text style={styles.finishButtonText}>Finish</Text>
                <Feather name="check" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => setCurrentStep(Math.min(guideSteps.length - 1, currentStep + 1))}
              >
                <Text style={styles.nextButtonText}>Next</Text>
                <Feather name="arrow-right" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
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
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
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
    position: 'relative',
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
  comingSoonBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#D97706',
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
    marginBottom: 40,
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2E5CFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  guideContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  guideIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  guideTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 16,
  },
  guideText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2E5CFF',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  navButtonDisabled: {
    borderColor: '#E5E7EB',
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E5CFF',
  },
  navButtonTextDisabled: {
    color: '#9CA3AF',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#2E5CFF',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#10B981',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  finishButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});