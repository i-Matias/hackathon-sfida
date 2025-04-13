import { Link } from "react-router-dom";
import "../styles/Home.css";
import "../styles/Animation.css";
import { useAuthStore } from "../stores/authStore";
import { useLanguage } from "../contexts/LanguageContext";
import AnimatedElement from "../components/AnimatedElement";

export default function Home() {
  const { user } = useAuthStore();
  const { t } = useLanguage();

  return (
    <div className="home-container">
      <AnimatedElement animation="fadeIn" duration={0.8}>
        <section className="hero">
          <h1 className="animate__animated animate__fadeInDown">
            {t("home.title")}
          </h1>
          <AnimatedElement animation="fadeIn" delay={0.3} duration={0.8}>
            <p className="tagline">{t("home.tagline")}</p>
          </AnimatedElement>

          <AnimatedElement animation="fadeInUp" delay={0.5} duration={0.8}>
            <div className="cta-buttons">
              {user ? (
                // Show appropriate buttons when logged in
                <>
                  {user.roleId === 2 ? (
                    // For customers show Products and Dashboard
                    <>
                      <Link
                        to="/products"
                        className="cta-button animated-button"
                      >
                        {t("home.viewProducts")}
                      </Link>
                      <Link
                        to="/consumer/dashboard"
                        className="cta-button secondary animated-button"
                      >
                        {t("home.viewDashboard")}
                      </Link>
                    </>
                  ) : (
                    // For farmers show just Dashboard
                    <Link
                      to="/farmer/dashboard"
                      className="cta-button animated-button"
                    >
                      {t("home.viewDashboard")}
                    </Link>
                  )}
                </>
              ) : (
                // Show only login and register buttons when logged out
                <>
                  <Link to="/login" className="cta-button animated-button">
                    {t("nav.login")}
                  </Link>
                  <Link
                    to="/register"
                    className="cta-button secondary animated-button"
                  >
                    {t("nav.register")}
                  </Link>
                </>
              )}
            </div>
          </AnimatedElement>
        </section>
      </AnimatedElement>

      <section className="features">
        <AnimatedElement animation="fadeInUp" delay={0.2} duration={0.8}>
          <div className="feature card-hover">
            <h2>{t("home.forFarmers")}</h2>
            <p>{t("home.farmersDesc")}</p>
          </div>
        </AnimatedElement>

        <AnimatedElement animation="fadeInUp" delay={0.4} duration={0.8}>
          <div className="feature card-hover">
            <h2>{t("home.forConsumers")}</h2>
            <p>{t("home.consumersDesc")}</p>
          </div>
        </AnimatedElement>
      </section>
    </div>
  );
}
