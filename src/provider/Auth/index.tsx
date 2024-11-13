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
  handleGoogleCallback: (responseData: { errorCode: number; errorMessage: string; resultData: { token: string } }) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  handleGoogleCallback: () => {},
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

      if (!token || !storedUser) {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } else {
        try {
          const parsedUser = JSON.parse(storedUser);
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

  const login = () => {
    const googleAuthUrl = `https://seamlessup.com/api/login`;
    window.location.href = googleAuthUrl;
  };

  const handleGoogleCallback = (responseData: { errorCode: number; errorMessage: string; resultData: { token: string } }) => {
    if (responseData.errorCode === 200 && responseData.resultData?.token) {
      // 토큰 저장
      localStorage.setItem("token", responseData.resultData.token);

      // 임시 유저 데이터 설정 (실제 유저 정보는 나중에 API 호출로 가져올 수 있음)
      const tempUser = {
        id: "temp",
        name: "User",
        email: "user@example.com",
      };
      setUser(tempUser);
      localStorage.setItem("user", JSON.stringify(tempUser));

      // 프로젝트 목록 페이지로 리다이렉트
      window.location.href = RouterPath.projectList;
    } else {
      console.error("Invalid response format or error in response");
      window.location.href = RouterPath.root;
    }
  };

  const logout = () => {
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