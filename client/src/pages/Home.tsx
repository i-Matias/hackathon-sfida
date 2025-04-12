import { Link } from "react-router-dom";
import "../styles/Home.css";
import { useAuthStore } from "../stores/authStore";
import { useLanguage } from "../contexts/LanguageContext";

export default function Home() {
  const { user } = useAuthStore();
  const { t } = useLanguage();

  return (
    <div className="home-container">
      <section className="hero">
        <h1>{t("home.title")}</h1>
        <p className="tagline">{t("home.tagline")}</p>
        <div className="cta-buttons">
          {user ? (
            // Show appropriate buttons when logged in
            <>
              <Link
                to={user.roleId === 2 ? "/products" : "/farmer/dashboard"}
                className="cta-button"
              >
                {user.roleId === 2
                  ? t("home.viewProducts")
                  : t("home.viewDashboard")}
              </Link>
              {user.roleId === 2 && (
                <Link to="/consumer/dashboard" className="cta-button">
                  {t("home.viewDashboard")}
                </Link>
              )}
            </>
          ) : (
            // Show only login and register buttons when logged out
            <>
              <Link to="/login" className="cta-button">
                {t("nav.login")}
              </Link>
              <Link to="/register" className="cta-button secondary">
                {t("nav.register")}
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <h2>{t("home.forFarmers")}</h2>
          <p>{t("home.farmersDesc")}</p>
        </div>
        <div className="feature">
          <h2>{t("home.forConsumers")}</h2>
          <p>{t("home.consumersDesc")}</p>
        </div>
      </section>
    </div>
  );
}
