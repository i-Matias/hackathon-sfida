import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { useAuthStore } from "../stores/authStore";
import { useLanguage } from "../contexts/LanguageContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { register, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!username || !email || !password) {
      return; // Form validation should handle this
    }

    try {
      await register({
        userName: username,
        email,
        password,
        roleId: role === "farmer" ? 1 : 2,
      });

      // Navigate based on role
      navigate("/");
    } catch (err) {
      // Error is handled in the store
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>{t("auth.registerTitle")}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">{t("auth.username")}</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("auth.usernamePlaceholder")}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">{t("auth.email")}</label>
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
            {isLoading ? t("auth.registering") : t("auth.registerButton")}
          </button>
        </form>

        <p className="auth-redirect">
          {t("auth.haveAccount")} <Link to="/login">{t("nav.login")}</Link>
        </p>
      </div>
    </div>
  );
}
