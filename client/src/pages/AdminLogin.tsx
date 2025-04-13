import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { useAuthStore } from "../stores/authStore";
import { useLanguage } from "../contexts/LanguageContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminError, setAdminError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { login, isLoading, error, clearError, logout } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setAdminError(null);

    if (!email || !password) {
      return; // Form validation should handle this
    }

    try {
      const user = await login({
        email,
        password,
      });

      // Check if the user is an admin (roleId === 3)
      if (user && user.roleId !== 3) {
        // If not an admin, show error and logout
        logout();
        setAdminError(
          t("auth.notAdmin") ||
            "You must be an administrator to access this section."
        );
        return;
      }

      // Navigate to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      // Error is handled in the store
    }
  };

  return (
    <div className="auth-container admin-auth-container">
      <div className="auth-form-container">
        <h2>{t("auth.adminLoginTitle") || "Admin Login"}</h2>

        {error && <div className="error-message">{error}</div>}
        {adminError && <div className="error-message">{adminError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.emailPlaceholder")}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t("auth.password")}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("auth.passwordPlaceholder")}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button admin-auth-button"
            disabled={isLoading}
          >
            {isLoading
              ? t("auth.loggingIn")
              : t("auth.adminLoginButton") || "Login as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
