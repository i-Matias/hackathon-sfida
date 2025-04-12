import { useEffect } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { PrivateRoute, PublicRoute } from "./components/RouteGuard";
import AddProduct from "./pages/AddProduct";
import ConsumerDashboard from "./pages/ConsumerDashboard";
import FarmerDashboard from "./pages/FarmerDashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import ProductList from "./pages/ProductList";
import Register from "./pages/Register";
import { useAuthStore } from "./stores/authStore";
import EditProduct from "./pages/EditProduct";
import axios from "./api/axios";

export default function App() {
  const { user, logout, setUser } = useAuthStore();

  // Check for stored token on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");

      // If there's a token but no user in state, try to restore the session
      if (token) {
        try {
          // Make a request to verify the token is still valid
          const response = await axios.get("/auth/me");
          if (response.data && response.data.user) {
            setUser(response.data.user);
          } else {
            // Clear token if user data is missing
            localStorage.removeItem("authToken");
          }
        } catch (error) {
          // If token is invalid, clear it and ensure user is logged out
          localStorage.removeItem("authToken");
          logout();
        }
      } else if (!token && user) {
        // If we have user data but no token, logout to clear the state
        logout();
      }
    };

    checkAuth();
  }, [setUser, logout, user]);

  // Helper function to determine role
  const getRole = () => {
    if (!user) return null;
    return user.roleId === 1 ? "farmer" : "customer";
  };

  const role = getRole();

  return (
    <Router>
      <div className="app-container">
        <Header
          user={user ? { id: user.id, role: role! } : null}
          onLogout={logout}
        />

        <main className="main-content">
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Home />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute restricted>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute restricted>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/products"
              element={
                <PublicRoute>
                  <ProductList />
                </PublicRoute>
              }
            />
            <Route
              path="/products/:id"
              element={
                <PublicRoute>
                  <ProductDetail
                    user={user ? { id: user.id, role: role! } : null}
                  />
                </PublicRoute>
              }
            />

            {/* Farmer Private Routes */}
            <Route
              path="/farmer/dashboard"
              element={
                <PrivateRoute requiredRole="farmer">
                  <FarmerDashboard userId={user?.id || 0} />
                </PrivateRoute>
              }
            />
            <Route
              path="/farmer/add-product"
              element={
                <PrivateRoute requiredRole="farmer">
                  <AddProduct userId={user?.id || 0} />
                </PrivateRoute>
              }
            />
            <Route
              path="/farmer/edit-product/:id"
              element={
                <PrivateRoute requiredRole="farmer">
                  <EditProduct userId={user?.id || 0} />
                </PrivateRoute>
              }
            />

            {/* Customer Private Routes */}
            <Route
              path="/consumer/dashboard"
              element={
                <PrivateRoute requiredRole="customer">
                  <ConsumerDashboard userId={user?.id || 0} />
                </PrivateRoute>
              }
            />

            {/* Fallback - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
