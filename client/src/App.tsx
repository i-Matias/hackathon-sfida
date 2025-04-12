import { useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import AddProduct from "./pages/AddProduct";
import ConsumerDashboard from "./pages/ConsumerDashboard";
import FarmerDashboard from "./pages/FarmerDashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import ProductList from "./pages/ProductList";
import Register from "./pages/Register";

export default function App() {
  // Simple auth state - in a real app, this would use context/redux
  const [user, setUser] = useState<{ id: number; role: string } | null>(null);

  // Mock login function - in a real app this would use proper auth
  const handleLogin = (userData: { id: number; role: string }) => {
    setUser(userData);
  };

  // Mock logout function
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="app-container">
        <Header user={user} onLogout={handleLogout} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route
              path="/register"
              element={<Register onLogin={handleLogin} />}
            />
            <Route
              path="/farmer/dashboard"
              element={
                user && user.role === "farmer" ? (
                  <FarmerDashboard userId={user.id} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/farmer/add-product"
              element={
                user && user.role === "farmer" ? (
                  <AddProduct userId={user.id} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/consumer/dashboard"
              element={
                user && user.role === "customer" ? (
                  <ConsumerDashboard userId={user.id} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/products" element={<ProductList />} />
            <Route
              path="/products/:id"
              element={<ProductDetail user={user} />}
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
