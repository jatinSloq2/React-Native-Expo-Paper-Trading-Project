import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import axiosInstance from "../api/axiosInstance";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    try {
      const res = await axiosInstance.post(
        "/auth/register",
        { name, email, password },
        { headers: { "X-API-Key": "your_api_key_here" } }
      );

      setSuccess("Registration successful. Please login.");
      setTimeout(() => navigation.navigate("Login"), 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-5">
      <Text className="text-3xl font-bold mb-6">Register</Text>

      {error ? <Text className="text-red-600 mb-3">{error}</Text> : null}
      {success ? <Text className="text-green-600 mb-3">{success}</Text> : null}

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        className="w-full p-3 border rounded mb-3"
      />

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
        onPress={handleRegister}
        className="w-full bg-blue-600 p-3 rounded"
      >
        <Text className="text-white text-center font-semibold">Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        className="mt-4"
      >
        <Text className="text-blue-600">Already have an account?</Text>
      </TouchableOpacity>
    </View>
  );
}
