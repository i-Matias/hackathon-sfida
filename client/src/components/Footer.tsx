import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>
          &copy; {new Date().getFullYear()} MerrBio - Të gjitha të drejtat e
          rezervuara
        </p>
        <div className="footer-links">
          <a href="#">Rreth Nesh</a>
          <a href="#">Kushtet e Përdorimit</a>
          <a href="#">Privatësia</a>
        </div>
      </div>
    </footer>
  );
}
