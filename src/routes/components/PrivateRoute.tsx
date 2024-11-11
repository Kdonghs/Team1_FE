import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../provider/Auth";
import { RouterPath } from "../path";

export const PrivateRoute = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  if (!user || !token) {
    return <Navigate to={RouterPath.root} />;
  }

  return <Outlet />;
};
