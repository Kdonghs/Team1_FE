import { Navigate, Outlet } from "react-router-dom";

import { authSessionStorage } from "../..//utils/storage";
import { useAuth } from "../../provider/Auth";
import { RouterPath } from "../path";

export const PrivateRoute = () => {
  const user = useAuth();
  const token = authSessionStorage.get()?.token;

  if (!user || !token) {
    console.log(user, token);
    return <Navigate to={RouterPath.root} />;
  }

  return <Outlet />;
};
