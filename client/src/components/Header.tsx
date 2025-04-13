import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { useLanguage } from "../contexts/LanguageContext";

interface HeaderProps {
  user: { id: number; role: string } | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const toggleLanguage = () => {
    const newLanguage = language === "sq" ? "en" : "sq";
    setLanguage(newLanguage);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          MerrBio
        </Link>

        <nav className="nav-links">
          {user ? (
            <>
              {/* Only show Products link to customers */}
              {user.role === "customer" && (
                <Link to="/products">{t("nav.products")}</Link>
              )}

              {user.role === "farmer" ? (
                <Link to="/farmer/dashboard">{t("nav.dashboard")}</Link>
              ) : (
                <Link to="/consumer/dashboard">{t("nav.dashboard")}</Link>
              )}

              {/* Add Profile link */}
              <Link to="/profile">{t("nav.profile")}</Link>

              <button onClick={handleLogout} className="logout-button">
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <>
              <Link to="/products">{t("nav.products")}</Link>
              <Link to="/login">{t("nav.login")}</Link>
              <Link to="/register">{t("nav.register")}</Link>
            </>
          )}
          <button onClick={toggleLanguage} className="language-toggle">
            {t("language")}
          </button>
        </nav>
      </div>
    </header>
  );
}
