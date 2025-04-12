import "../styles/Footer.css";
import { useLanguage } from "../contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-container">
        <p>
          &copy; {new Date().getFullYear()} MerrBio - {t("footer.rights")}
        </p>
        <div className="footer-links">
          <a href="#">{t("footer.about")}</a>
          <a href="#">{t("footer.terms")}</a>
          <a href="#">{t("footer.privacy")}</a>
        </div>
      </div>
    </footer>
  );
}
