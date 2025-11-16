import { Feather } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import axiosInstance from "../../../api/axiosInstance";

export default function ChangePasswordScreen() {
  const navigation = useNavigation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleChangePassword = async () => {
    // Validation
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }

    if (!newPassword) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      Alert.alert('Error', passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Error', 'New password must be different from current password');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const apiKey = await AsyncStorage.getItem("api_key");

      await axiosInstance.post(
        "/auth/change-password",
        {
          currentPassword,
          newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-API-Key": apiKey || "",
          },
        }
      );

      Alert.alert(
        'Success',
        'Password changed successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Password change error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to change password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

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
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <View style={styles.infoBannerIcon}>
              <Feather name="shield" size={24} color="#2E5CFF" />
            </View>
            <View style={styles.infoBannerContent}>
              <Text style={styles.infoBannerTitle}>Security First</Text>
              <Text style={styles.infoBannerText}>
                Choose a strong password to keep your account secure
              </Text>
            </View>
          </View>

          {/* Current Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Password</Text>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showCurrentPassword}
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                style={styles.eyeIcon}
              >
                <Feather
                  name={showCurrentPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>New Password</Text>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeIcon}
              >
                <Feather
                  name={showNewPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm New Password</Text>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Feather
                  name={showConfirmPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Password Requirements */}
          <View style={styles.requirementsBox}>
            <Text style={styles.requirementsTitle}>Password Requirements:</Text>
            <PasswordRequirement
              text="At least 8 characters long"
              met={newPassword.length >= 8}
            />
            <PasswordRequirement
              text="Contains uppercase letter (A-Z)"
              met={/[A-Z]/.test(newPassword)}
            />
            <PasswordRequirement
              text="Contains lowercase letter (a-z)"
              met={/[a-z]/.test(newPassword)}
            />
            <PasswordRequirement
              text="Contains number (0-9)"
              met={/[0-9]/.test(newPassword)}
            />
          </View>
        </View>
      </ScrollView>

      {/* Change Password Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleChangePassword}
          disabled={loading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#2E5CFF', '#1A3FCC']}
            style={styles.changeButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Feather name="check" size={20} color="#FFFFFF" />
                <Text style={styles.changeButtonText}>Change Password</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PasswordRequirement({ text, met }) {
  return (
    <View style={styles.requirementItem}>
      <Feather
        name={met ? "check-circle" : "circle"}
        size={16}
        color={met ? "#10B981" : "#9CA3AF"}
      />
      <Text style={[styles.requirementText, met && styles.requirementTextMet]}>
        {text}
      </Text>
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
  formSection: {
    padding: 20,
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
  infoBannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
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
    color: '#1E40AF',
    marginBottom: 4,
  },
  infoBannerText: {
    fontSize: 12,
    color: '#3B82F6',
    lineHeight: 18,
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
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 15,
    color: '#1A1A1A',
  },
  eyeIcon: {
    padding: 4,
  },
  requirementsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  requirementText: {
    fontSize: 13,
    color: '#6B7280',
  },
  requirementTextMet: {
    color: '#10B981',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  changeButton: {
    flexDirection: 'row',
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  changeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});