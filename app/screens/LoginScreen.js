import { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    setError("");
    setSuccess("");

    try {
      const apiKey = "your_api_key_here";

      const res = await axiosInstance.post(
        "/auth/login",
        { email, password },
        { headers: { "X-API-Key": apiKey } }
      );

      const { token, user } = res.data;

      await login(token, apiKey, user);

      setSuccess("Login successful.");
      setTimeout(() => navigation.navigate("Home"), 1200);

    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-5">
      <Text className="text-3xl font-bold mb-6">Login</Text>

      {error ? <Text className="text-red-600 mb-3">{error}</Text> : null}
      {success ? <Text className="text-green-600 mb-3">{success}</Text> : null}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="w-full p-3 border rounded mb-3"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="w-full p-3 border rounded mb-5"
      />

      <TouchableOpacity
        onPress={handleLogin}
        className="w-full bg-blue-600 p-3 rounded"
      >
        <Text className="text-white text-center font-semibold">Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        className="mt-4"
      >
        <Text className="text-blue-600">Create an Account</Text>
      </TouchableOpacity>
    </View>
  );
}
