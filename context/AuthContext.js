import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../app/api/axiosInstance";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      const storedApiKey = await AsyncStorage.getItem("api_key");

      if (storedToken) {
        setToken(storedToken);
        setApiKey(storedApiKey || "");
        await fetchUser(storedToken, storedApiKey);
      }

      setLoading(false);
    };

    loadStoredAuth();
  }, []);

  const fetchUser = async (jwt, key) => {
    try {
      const res = await axiosInstance.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "X-API-Key": key || "",
        },
      });
      setUser(res.data.user);
    } catch (err) {
      console.log("Failed to fetch user:", err.response?.data);
      logout();
    }
  };

  const login = async (jwt, key, fetchedUser) => {
    setToken(jwt);
    setApiKey(key);
    setUser(fetchedUser);

    await AsyncStorage.setItem("token", jwt);
    await AsyncStorage.setItem("api_key", key || "");
  };

  const logout = async () => {
    setToken("");
    setUser(null);
    setApiKey("");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("api_key");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, apiKey, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
