import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { JSX } from "react";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

export default PublicRoute;
