import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import logoImage from "../../assets/mainLogoBlack.png"

export default function AccountScreen() {
  const {
    user,
    token,
    apiKey,
    loading,
    logout
  } = useContext(AuthContext);

  const navigation = useNavigation();

  // Local UI states only
  const [addAmount, setAddAmount] = useState("");
  const [deductAmount, setDeductAmount] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeductModal, setShowDeductModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const apiKey = await AsyncStorage.getItem("api_key");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await axiosInstance.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-Key": apiKey || "",
        },
      });

      setUser(res.data.user);
    } catch (err) {
      console.log("Error fetching user info:", err.response?.data || err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);


  // SUCCESS / ERROR MODALS
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  // AUTH HEADERS DIRECTLY FROM CONTEXT
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`,
    "X-API-Key": apiKey || "",
  });

  // ADD BALANCE
  const handleAddBalance = async () => {
    const amount = parseFloat(addAmount);
    if (!amount || amount <= 0) {
      showError("Please enter a valid positive amount");
      return;
    }

    setActionLoading(true);

    try {
      const res = await axiosInstance.post(
        "/balance/add",
        { amount, reason: "ADD_FUNDS", meta: { source: "mobile_app" } },
        { headers: getAuthHeaders() }
      );

      // Update UI directly (NOT context)
      user.virtualBalance = res.data.virtualBalance;

      setAddAmount("");
      setShowAddModal(false);
      showSuccess(`${user.currency}${amount.toFixed(2)} added to your account`);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to add balance");
    } finally {
      setActionLoading(false);
    }
  };

  // DEDUCT BALANCE
  const handleDeductBalance = async () => {
    const amount = parseFloat(deductAmount);
    if (!amount || amount <= 0) {
      showError("Please enter a valid positive amount");
      return;
    }

    setActionLoading(true);

    try {
      const res = await axiosInstance.post(
        "/balance/deduct",
        { amount, reason: "DEDUCT_FUNDS", meta: { source: "mobile_app" } },
        { headers: getAuthHeaders() }
      );

      user.virtualBalance = res.data.virtualBalance;

      setDeductAmount("");
      setShowDeductModal(false);
      showSuccess(`${user.currency}${amount.toFixed(2)} deducted from your account`);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to deduct balance");
    } finally {
      setActionLoading(false);
    }
  };

  // LOGOUT
  const performLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      showError("Failed to logout. Please try again.");
    }
  };

  const handleViewHistory = () => {
    navigation.navigate("BalanceHistory");
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleMarketWatch = () => {
    navigation.navigate("MarketWatch");
  };

  const handleLearningHub = () => {
    navigation.navigate("LearningHub");
  };

  const handleSettings = () => {
    navigation.navigate("Settings");
  };


  // Loading UI
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={['#2E5CFF', '#1A3FCC']}
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.smallLogo}>
              <Image
                source={logoImage}
                style={styles.smallLogoImage}
                resizeMode="contain"
              />
            </View>
          </LinearGradient>
          <Text style={styles.brandName}>Paper Bull</Text>
        </View>
        <ActivityIndicator size="large" color="#2E5CFF" />
        <Text style={styles.loadingText}>Loading your account...</Text>
      </View>
    );
  }

  // USER NOT LOGGED IN
  if (!user) {
    return (
      <View style={styles.notLoggedInContainer}>
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={['#2E5CFF', '#1A3FCC']}
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.smallLogo}>
              <Image
                source={logoImage}
                style={styles.smallLogoImage}
                resizeMode="contain"
              />
            </View>
          </LinearGradient>
          <Text style={styles.brandName}>Paper Bull</Text>
        </View>

        <Text style={styles.notLoggedInTitle}>Master Trading Skills</Text>
        <Text style={styles.notLoggedInSubtitle}>
          Practice trading with virtual money in a real market environment
        </Text>

        <View style={styles.authButtonsContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#2E5CFF', '#1A3FCC']}
              style={styles.primaryButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.primaryButtonText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            style={styles.secondaryButton}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Why Practice Trading?</Text>
          <FeatureItem icon="book-open" text="Learn without financial risk" />
          <FeatureItem icon="bar-chart-2" text="Real-time market data" />
          <FeatureItem icon="zap" text="Build trading strategies" />
          <FeatureItem icon="trending-up" text="Track your performance" />
        </View>
      </View>
    );
  }

  // USER LOGGED IN
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <LinearGradient
        colors={['#2E5CFF', '#1A3FCC']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <View style={styles.brandHeader}>
            <View style={styles.smallLogo}>
              <Image
                source={logoImage}
                style={styles.smallLogoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.headerBrandName}>Paper Bull</Text>
          </View>
        </View>

        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Virtual Portfolio</Text>
            <View style={styles.practiceTag}>
              <Text style={styles.practiceTagText}>PRACTICE</Text>
            </View>
          </View>
          <Text style={styles.balanceAmount}>
            {user?.currency} {user?.virtualBalance?.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </Text>
          <Text style={styles.balanceSubtext}>
            Not real money • For learning purposes only
          </Text>
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Account Type</Text>
          <Text style={styles.statValue}>Paper Trading</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Status</Text>
          <Text style={[styles.statValue, { color: user?.isActive ? '#10B981' : '#EF4444' }]}>
            {user?.isActive ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      {/* Account Details Section */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Account Information</Text>

        <View style={styles.detailsCard}>
          <DetailRow label="Email Address" value={user?.email} />
          <DetailRow label="Trading Currency" value={user?.currency} />
          <DetailRow label="Phone" value={user?.phone} />
          <DetailRow label="Country" value={user?.country} />
          <DetailRow
            label="Member Since"
            value={new Date(user?.createdAt).toLocaleDateString("en-IN", {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          />
        </View>

        {/* Balance Management */}
        <Text style={styles.sectionTitle}>Balance Management</Text>
        <View style={styles.balanceActionsGrid}>
          <BalanceActionCard
            icon="plus-circle"
            label="Add Funds"
            color="#10B981"
            onPress={() => setShowAddModal(true)}
          />
          <BalanceActionCard
            icon="minus-circle"
            label="Deduct"
            color="#F59E0B"
            onPress={() => setShowDeductModal(true)}
          />
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <ActionCard
            icon="briefcase"
            label="History"
            onPress={handleViewHistory}
          />
          <ActionCard
            icon="activity"
            label="Market Watch"
            onPress={handleMarketWatch}
          />
          <ActionCard
            icon="book-open"
            label="Learning Hub"
            onPress={handleLearningHub}
          />
          <ActionCard
            icon="settings"
            label="Settings"
            onPress={handleSettings}
          />
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <View style={styles.infoBannerIconContainer}>
            <Feather name="info" size={30} color="#3B82F6" />
          </View>
          <View style={styles.infoBannerContent}>
            <Text style={styles.infoBannerTitle}>Practice Trading Only</Text>
            <Text style={styles.infoBannerText}>
              This is a simulation environment. All trades use virtual money for learning purposes.
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Add Balance Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Virtual Funds</Text>
            <Text style={styles.modalSubtitle}>
              Enter the amount you want to add to your virtual balance
            </Text>

            <View style={styles.modalInputContainer}>
              <Text style={styles.modalInputLabel}>Amount ({user?.currency})</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={addAmount}
                onChangeText={setAddAmount}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowAddModal(false);
                  setAddAmount("");
                }}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleAddBalance}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.modalButtonTextConfirm}>Add Funds</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Deduct Balance Modal */}
      <Modal
        visible={showDeductModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeductModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Deduct Virtual Funds</Text>
            <Text style={styles.modalSubtitle}>
              Enter the amount you want to deduct from your virtual balance
            </Text>

            <View style={styles.modalInputContainer}>
              <Text style={styles.modalInputLabel}>Amount ({user?.currency})</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={deductAmount}
                onChangeText={setDeductAmount}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowDeductModal(false);
                  setDeductAmount("");
                }}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleDeductBalance}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.modalButtonTextConfirm}>Deduct</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalSubtitle}>
              Are you sure you want to logout from your account?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDanger]}
                onPress={performLogout}
              >
                <Text style={styles.modalButtonTextConfirm}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIcon}>
              <Feather name="check" size={32} color="#10B981" />
            </View>
            <Text style={styles.modalTitle}>Success</Text>
            <Text style={styles.modalSubtitle}>{successMessage}</Text>

            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonConfirm, { width: '100%' }]}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.modalButtonTextConfirm}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal
        visible={showErrorModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.errorIcon}>
              <Feather name="x" size={32} color="#DC2626" />
            </View>
            <Text style={styles.modalTitle}>Error</Text>
            <Text style={styles.modalSubtitle}>{errorMessage}</Text>

            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonDanger, { width: '100%' }]}
              onPress={() => setShowErrorModal(false)}
            >
              <Text style={styles.modalButtonTextConfirm}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function FeatureItem({ icon, text }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIconContainer}>
        <Feather name={icon} size={20} color="#2E5CFF" />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

function DetailRow({ label, value, valueColor, isLast }) {
  return (
    <View style={[styles.detailRow, isLast && styles.detailRowLast]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[
        styles.detailValue,
        valueColor && { color: valueColor }
      ]}>
        {value}
      </Text>
    </View>
  );
}

function ActionCard({ icon, label, onPress }) {
  return (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.actionIconContainer}>
        <Feather name={icon} size={24} color="#2E5CFF" />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function BalanceActionCard({ icon, label, color, onPress }) {
  return (
    <TouchableOpacity
      style={styles.balanceActionCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.balanceActionIconContainer, { backgroundColor: `${color}15` }]}>
        <Feather name={icon} size={26} color={color} />
      </View>
      <Text style={styles.balanceActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2E5CFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 42,
  },
  brandName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: '#6B7280',
  },
  notLoggedInContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
  },
  notLoggedInTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  notLoggedInSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  authButtonsContainer: {
    width: '100%',
    gap: 14,
    marginBottom: 48,
  },
  primaryButton: {
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2E5CFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2E5CFF',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#2E5CFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  featuresContainer: {
    width: '100%',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    marginBottom: 24,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  smallLogoEmoji: {
    fontSize: 18,
  },
  headerBrandName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.85,
  },
  userName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  balanceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    fontWeight: '500',
  },
  practiceTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  practiceTagText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 1,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  balanceSubtext: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.75,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  detailsSection: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 14,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  balanceActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  balanceActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  balanceActionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  balanceActionIcon: {
    fontSize: 26,
  },
  balanceActionLabel: {
    fontSize: 13,
    color: '#1A1A1A',
    fontWeight: '600',
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionLabel: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
    textAlign: 'center',
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  infoBannerIconContainer: {
    marginRight: 10,
    marginTop: 11
  },
  infoBannerIcon: {
    marginTop: 50,
  },
  infoBannerContent: {
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 4,
  },
  infoBannerText: {
    fontSize: 13,
    color: '#3B82F6',
    lineHeight: 18,
  },
  logoutButton: {
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalInputContainer: {
    marginBottom: 24,
  },
  modalInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  smallLogoImage: {
    width: 40,
    height: 40,
  },
  modalInput: {
    height: 52,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalButtonConfirm: {
    backgroundColor: '#2E5CFF',
  },
  modalButtonDanger: {
    backgroundColor: '#DC2626',
  },
  modalButtonTextCancel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  modalButtonTextConfirm: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  successIconText: {
    fontSize: 32,
    color: '#10B981',
    fontWeight: '700',
  },
  errorIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  errorIconText: {
    fontSize: 32,
    color: '#DC2626',
    fontWeight: '700',
  },
})