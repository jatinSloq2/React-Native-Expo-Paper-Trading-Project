import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../app/api/axiosInstance";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(true);

  // -------------------------------
  // Load token on first app load
  // -------------------------------
  useEffect(() => {
    const loadStoredAuth = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      const storedApiKey = await AsyncStorage.getItem("api_key");

      if (storedToken) {
        setToken(storedToken);
        setApiKey(storedApiKey || "");
        await fetchUser(storedToken);
      }

      setLoading(false);
    };
    loadStoredAuth();
  }, []);

  // ---------------------------------------------------------
  // AXIOS INTERCEPTOR — Attaches token to every API request
  // ---------------------------------------------------------
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Cleanup when provider unmounts or token changes
    return () => {
      axiosInstance.interceptors.request.eject(interceptor);
    };
  }, [token]);

  // Fetch user
  const fetchUser = async (jwt) => {
    try {
      const res = await axiosInstance.get("/auth/me");
      setUser(res.data.user);
    } catch (err) {
      console.log("Failed to fetch user:", err.response?.data);
      logout();
    }
  };

  // Login
  const login = async (jwt, key, fetchedUser) => {
    setToken(jwt);
    setApiKey(key);
    setUser(fetchedUser);

    await AsyncStorage.setItem("token", jwt);
    await AsyncStorage.setItem("api_key", key || "");
  };

  // Logout
  const logout = async () => {
    try {
      setToken("");
      setUser(null);
      setApiKey("");

      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("api_key");

      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, apiKey, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
