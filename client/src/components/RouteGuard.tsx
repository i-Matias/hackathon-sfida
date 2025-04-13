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
    let userRole;

    if (user.roleId === 1) userRole = "farmer";
    else if (user.roleId === 2) userRole = "customer";
    else if (user.roleId === 3) userRole = "admin";

    if (userRole !== requiredRole) {
      // Redirect to appropriate dashboard based on role
      if (userRole === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        return <Navigate to={`/${userRole}/dashboard`} replace />;
      }
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
    let userRole;

    if (user.roleId === 1) userRole = "farmer";
    else if (user.roleId === 2) userRole = "customer";
    else if (user.roleId === 3) userRole = "admin";

    if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to={`/${userRole}/dashboard`} replace />;
    }
  }

  return <>{children}</>;
};
