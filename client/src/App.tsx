import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./routes/privateRoute";
import Login from "./pages/login";
import Signup from "./pages/signup";
import AdminDashboard from "./pages/admin";
import FarmerDashboard from "./pages/product";
import ConsumerProducts from "./pages/consumerProducts";
import { useAuthStore } from "./stores/useAuthStore";

function DashboardWrapper() {
  const { role } = useAuthStore();

  if (role === "admin") {
    return <AdminDashboard />;
  } else if (role === "farmer") {
    return <FarmerDashboard />;
  } else if (role === "consumer") {
    return <ConsumerProducts />;
  } else {
    return <Navigate to="/login" replace />;
  }
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardWrapper />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
