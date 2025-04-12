import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { JSX } from "react";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
