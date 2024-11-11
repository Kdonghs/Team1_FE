import axios from "axios";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

import { RouterPath } from "../../routes/path";

type User = {
  id: string;
  name: string;
  email: string;
  picture?: string;
};

type AuthContextType = {
  user: User | null;
  login: () => void;
  logout: () => void;
  handleGoogleCallback: (code: string) => Promise<void>;
};

const API_URL = process.env.REACT_APP_API_URL;
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  handleGoogleCallback: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("에러: AuthProvider를 찾을 수 없습니다.");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing stored user:", error);
      return null;
    }
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      console.log("Checking auth - Token:", token);
      console.log("Checking auth - Stored user:", storedUser);

      if (!token || !storedUser) {
        console.log("No token or user found, clearing user state");
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } else {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log("Setting user from stored data:", parsedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing stored user:", error);
          setUser(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    console.log("User state changed:", user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user]);

  const login = () => {
    console.log("Initiating Google login");
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&response_type=code&scope=email%20profile&redirect_uri=${encodeURIComponent(
      REDIRECT_URI,
    )}`;
    window.location.href = googleAuthUrl;
  };

  const handleGoogleCallback = async (code: string) => {
    try {
      console.log("Starting Google callback process with code:", code);
      const response = await axios.post(`${API_URL}/api/v1/login/google`, {
        code,
      });
      console.log("Received response from backend:", response.data);

      const { accessToken, userData } = response.data;

      if (!accessToken || !userData) {
        console.error("Missing token or user data in response");
        throw new Error("Invalid response format");
      }

      localStorage.setItem("token", accessToken);
      const newUser = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        picture: userData.picture,
      };

      console.log("Setting user state to:", newUser);
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));

      window.location.href = RouterPath.projectList;
    } catch (error) {
      console.error("Google login error:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
      }
      throw error;
    }
  };

  const logout = () => {
    console.log("Logging out");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = RouterPath.root;
  };

  const value = {
    user,
    login,
    logout,
    handleGoogleCallback,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
