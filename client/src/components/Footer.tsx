import "../styles/Footer.css";
import "../styles/Animation.css";
import { useLanguage } from "../contexts/LanguageContext";
import AnimatedElement from "./AnimatedElement";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <AnimatedElement animation="fadeIn" delay={0.3} duration={0.8}>
      <footer className="footer">
        <div className="footer-container">
          <p>
            &copy; {new Date().getFullYear()} MerrBio - {t("footer.rights")}
          </p>
          <div className="footer-links">
            <a href="#" className="animated-button">
              {t("footer.about")}
            </a>
            <a href="#" className="animated-button">
              {t("footer.terms")}
            </a>
            <a href="#" className="animated-button">
              {t("footer.privacy")}
            </a>
          </div>
        </div>
      </footer>
    </AnimatedElement>
  );
}
