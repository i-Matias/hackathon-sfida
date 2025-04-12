import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Auth.css";
import { useAuthStore } from "../stores/authStore";
import { useLanguage } from "../contexts/LanguageContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we have a redirect path from a previous navigation attempt
  const from =
    location.state?.from?.pathname ||
    (role === "farmer" ? "/farmer/dashboard" : "/consumer/dashboard");

  const { t } = useLanguage();

  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email || !password) {
      return; // Form validation should handle this
    }

    try {
      await login({
        email,
        password,
        roleId: role === "farmer" ? 1 : 2,
      });

      // Navigate to the intended destination or default dashboard based on role
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled in the store
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>{t("auth.loginTitle")}</h2>

        {error && <div className="error-message">{error}</div>}

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
            <label htmlFor="password">{t("auth.passwordPlaceholder")}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("auth.passwordPlaceholder")}
              required
            />
          </div>

          <div className="form-group">
            <label>{t("auth.role")}</label>
            <div className="role-selection">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="farmer"
                  checked={role === "farmer"}
                  onChange={() => setRole("farmer")}
                />
                &nbsp;
                {t("auth.farmer")}
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={role === "customer"}
                  onChange={() => setRole("customer")}
                />
                &nbsp;
                {t("auth.customer")}
              </label>
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? t("auth.loggingIn") : t("auth.loginButton")}
          </button>
        </form>

        <p className="auth-redirect">
          {t("auth.noAccount")}{" "}
          <Link to="/register">{t("auth.registerButton")}</Link>
        </p>
      </div>
    </div>
  );
}
