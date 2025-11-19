import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../app/api/axiosInstance";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(true);

  // Load stored token & user on app start
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedApiKey = await AsyncStorage.getItem("api_key");

        if (storedToken) {
          setToken(storedToken);
          setApiKey(storedApiKey || "");
          await fetchUser(storedToken); // this is enough
        }
      } catch (e) {
        console.log("Auth load error:", e);
      }

      setLoading(false);
    };

    loadStoredAuth();
  }, []);

  // Axios interceptor attaches token
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosInstance.interceptors.request.eject(interceptor);
    };
  }, [token]);

  // Fetch user data
  const fetchUser = async (jwt) => {
    try {
      const res = await axiosInstance.get("/auth/me", {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      setUser(res.data.user);
    } catch (err) {
      console.log("Fetch user error:", err.response?.data);

      // Only logout on 401 unauthorized
      if (err.response?.status === 401) logout();
    }
  };

  // Login function
  const login = async (jwt, key, fetchedUser) => {
    setToken(jwt);
    setApiKey(key);
    setUser(fetchedUser);

    await AsyncStorage.setItem("token", jwt);
    await AsyncStorage.setItem("api_key", key || "");
  };

  // Logout function
  const logout = async () => {
    try {
      setUser(null);
      setToken("");
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
