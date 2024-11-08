import axios from "axios";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

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
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&response_type=code&scope=email%20profile&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = googleAuthUrl;
  };

  const handleGoogleCallback = async (code: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/login/google`, { code });
      const { accessToken, userData } = response.data;

      localStorage.setItem('token', accessToken);
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        picture: userData.picture
      });
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    handleGoogleCallback,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};