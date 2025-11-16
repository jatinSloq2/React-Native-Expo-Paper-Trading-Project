import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../../context/AuthContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../../api/axiosInstance";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, setUser } = useContext(AuthContext);
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [country, setCountry] = useState(user?.country || '');
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const apiKey = await AsyncStorage.getItem("api_key");

      const response = await axiosInstance.put(
        "/auth/update-profile",
        {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          country: country.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-API-Key": apiKey || "",
          },
        }
      );

      // Update user context
      if (setUser) {
        setUser(response.data.user);
      }

      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update profile. Please try again.'
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
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>
              {name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <TouchableOpacity style={styles.changePhotoButton}>
            <Feather name="camera" size={16} color="#2E5CFF" />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Feather name="phone" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Country</Text>
            <View style={styles.inputContainer}>
              <Feather name="map-pin" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={country}
                onChangeText={setCountry}
                placeholder="Enter your country"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.infoBox}>
            <Feather name="info" size={16} color="#3B82F6" />
            <Text style={styles.infoText}>
              Fields marked with * are required
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleSaveProfile}
          disabled={loading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#2E5CFF', '#1A3FCC']}
            style={styles.saveButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Feather name="check" size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2E5CFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarLargeText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E5CFF',
  },
  formSection: {
    padding: 20,
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 10,
    gap: 10,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#3B82F6',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    flexDirection: 'row',
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});