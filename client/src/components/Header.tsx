import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import "../styles/Animation.css";
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
        <Link
          to="/"
          className="logo animate__animated animate__pulse animate__slow animate__infinite"
        >
          MerrBio
        </Link>

        <nav className="nav-links">
          {user ? (
            <>
              {/* Show different links based on user role */}
              {user.role === "customer" && (
                <Link
                  to="/products"
                  className="animate__animated animate__fadeIn"
                >
                  {t("nav.products")}
                </Link>
              )}

              {user.role === "farmer" ? (
                <Link
                  to="/farmer/dashboard"
                  className="animate__animated animate__fadeIn"
                >
                  {t("nav.dashboard")}
                </Link>
              ) : user.role === "customer" ? (
                <Link
                  to="/consumer/dashboard"
                  className="animate__animated animate__fadeIn"
                >
                  {t("nav.dashboard")}
                </Link>
              ) : (
                user.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="animate__animated animate__fadeIn"
                  >
                    {t("nav.adminDashboard") || "Admin Dashboard"}
                  </Link>
                )
              )}

              {/* Add Profile link */}
              <Link to="/profile" className="animate__animated animate__fadeIn">
                {t("nav.profile")}
              </Link>

              <button
                onClick={handleLogout}
                className="logout-button animate__animated animate__fadeIn animated-button"
              >
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/products"
                className="animate__animated animate__fadeIn"
              >
                {t("nav.products")}
              </Link>
              <Link to="/login" className="animate__animated animate__fadeIn">
                {t("nav.login")}
              </Link>
              <Link
                to="/register"
                className="animate__animated animate__fadeIn"
              >
                {t("nav.register")}
              </Link>
              <Link
                to="/admin/login"
                className="admin-login-link animate__animated animate__fadeIn"
              >
                {t("nav.adminLogin") || "Admin"}
              </Link>
            </>
          )}
          <button
            onClick={toggleLanguage}
            className="language-toggle animate__animated animate__fadeIn animated-button"
          >
            {language === "sq" ? "EN" : "SQ"}
          </button>
        </nav>
      </div>
    </header>
  );
}
