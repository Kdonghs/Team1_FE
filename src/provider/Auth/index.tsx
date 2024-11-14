import type { ReactNode } from "react";
import { useContext, useEffect, useState } from "react";
import { createContext } from "react";

import { useGetUserData } from "../../api/hooks/useGetUserdata";
import { RouterPath } from "../../routes/path";
import { authSessionStorage } from "../../utils/storage";

type User = {
  username: string;
  email: string;
  picture?: string;
  role?: string;
  createDate?: string;
};

export const AuthContext = createContext<{
  user: User | null;
  login: () => void;
  logout: () => void;
  handleGoogleCallback: () => void;
  isReady: boolean;
}>({
  user: null,
  login: () => {},
  logout: () => {},
  handleGoogleCallback: () => {},
  isReady: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("에러: AuthProvider를 찾을 수 없습니다.");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  const { data, error } = useGetUserData();

  const currentAuthToken = authSessionStorage.get();

  const login = () => {
    const googleAuthUrl = `https://seamlessup.com/api/login`;
    window.location.href = googleAuthUrl;
  };

  const logout = () => {
    authSessionStorage.set(undefined);
    localStorage.removeItem("user");

    window.location.href = RouterPath.root;
  };

  const handleGoogleCallback = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("accessToken");

    if (accessToken) {
      authSessionStorage.set(accessToken);
      localStorage.getItem("user");
      window.location.href = RouterPath.projectList;
    } else {
      window.location.href = RouterPath.root;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!currentAuthToken) {
          setIsReady(true);
          return;
        }

        if (data) {
          const newUser = {
            username: data?.resultData?.username || "",
            email: data?.resultData?.email || "",
            picture: data?.resultData?.picture || "",
            role: data?.resultData?.role || "",
            createDate: data?.resultData?.createDate || "",
          };

          setUser(newUser);
          localStorage.setItem("user", JSON.stringify(newUser));
        }

        if (error) {
          setUser(null);
          localStorage.removeItem("user");
        }

        setIsReady(true);
      } catch (err) {
        console.error("Error:", err);
        setUser(null);
        localStorage.removeItem("user");
        setIsReady(true);
      }
    };

    fetchUserData();
  }, [currentAuthToken, data, error]);

  if (!isReady) return null;

  const value = {
    user,
    login,
    handleGoogleCallback,
    logout,
    isReady,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
