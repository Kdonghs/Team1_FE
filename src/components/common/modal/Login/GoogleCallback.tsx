import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../../../provider/Auth";

export const GoogleCallback = () => {
  const location = useLocation();
  const { handleGoogleCallback } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get("code");

        if (!code) {
          console.error("No code found in URL");
          navigate("/");
          return;
        }

        // await handleGoogleCallback(code);
      } catch (error) {
        console.error("Error during callback handling:", error);
        navigate("/");
      }
    };

    handleCallback();
  }, [location, handleGoogleCallback, navigate]);

  return <div>Loading...</div>; // 로딩 상태를 보여줄 수 있음
};
