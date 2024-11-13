import { useEffect } from "react";

import { useAuth } from "../../provider/Auth";
import { RouterPath } from "../../routes/path";

export const LoginPage = () => {
  const { user, handleGoogleCallback } = useAuth();

  useEffect(() => {
    if (!user) {
      handleGoogleCallback();
    } else {
      window.location.href = RouterPath.projectList;
    }
  }, [user, handleGoogleCallback]);

  return <h1>Loading...</h1>;
};