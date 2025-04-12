import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

interface PrivateRouteProps {
  children: ReactNode;
  requiredRole?: string; // Optional role requirement
}

export const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    // Redirect to login if not authenticated, but remember where they were going
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required, check if user has the required role
  if (requiredRole) {
    const userRole = user.roleId === 1 ? "farmer" : "customer";
    if (userRole !== requiredRole) {
      // Redirect to appropriate dashboard if they don't have the required role
      return <Navigate to={`/${userRole}/dashboard`} replace />;
    }
  }

  return <>{children}</>;
};

interface PublicRouteProps {
  children: ReactNode;
  restricted?: boolean; // If true, authenticated users will be redirected away
}

export const PublicRoute = ({
  children,
  restricted = false,
}: PublicRouteProps) => {
  const { user } = useAuthStore();

  // If route is restricted and user is logged in, redirect to appropriate dashboard
  if (restricted && user) {
    const userRole = user.roleId === 1 ? "farmer" : "customer";
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  return <>{children}</>;
};
