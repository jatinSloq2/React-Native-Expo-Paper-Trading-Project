import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../api/axiosInstance";
import { useNavigation } from "@react-navigation/native";

export default function AccountScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const apiKey = await AsyncStorage.getItem("api_key");

      // If no token — user NOT logged in
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Logged in — call API
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

  // Loading UI
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-gray-600">Loading account...</Text>
      </View>
    );
  }

  // USER NOT LOGGED IN
  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-5">
        <Text className="text-2xl font-semibold mb-6">You are not logged in</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          className="bg-blue-500 px-6 py-3 rounded-xl mb-4"
        >
          <Text className="text-white text-lg font-medium">Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          className="bg-green-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white text-lg font-medium">Register</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // USER LOGGED IN — Show Account Details
  return (
    <View className="flex-1 bg-white p-5">
      <Text className="text-3xl font-semibold mb-4">Account Details</Text>

      <View className="bg-gray-100 p-5 rounded-2xl space-y-3">

        <Text className="text-lg font-medium">
          Name: <Text className="font-normal">{user?.name}</Text>
        </Text>

        <Text className="text-lg font-medium">
          Email: <Text className="font-normal">{user?.email}</Text>
        </Text>

        <Text className="text-lg font-medium">
          Role: <Text className="font-normal capitalize">{user?.role}</Text>
        </Text>

        <Text className="text-lg font-medium">
          Virtual Balance:{" "}
          <Text className="font-normal">
            {user?.currency} {user?.virtualBalance?.toLocaleString("en-IN")}
          </Text>
        </Text>

        <Text className="text-lg font-medium">
          Currency: <Text className="font-normal">{user?.currency}</Text>
        </Text>

        <Text className="text-lg font-medium">
          Created At:{" "}
          <Text className="font-normal">
            {new Date(user?.createdAt).toDateString()}
          </Text>
        </Text>

        <Text className="text-lg font-medium">
          Status: <Text className="font-normal">{user?.isActive ? "Active" : "Inactive"}</Text>
        </Text>

        <Text className="text-lg font-medium">
          Blocked: <Text className="font-normal">{user?.blocked ? "Yes" : "No"}</Text>
        </Text>

      </View>
    </View>
  );
}
