import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>MerrBio</h1>
        <p className="tagline">
          Produkte të freskëta, organike, dhe vendore direkt nga fermerët
        </p>
        <div className="cta-buttons">
          <Link to="/login" className="cta-button">
            Hyr
          </Link>
          <Link to="/register" className="cta-button secondary">
            Regjistrohu
          </Link>
          <Link to="/products" className="cta-button outline">
            Shiko produktet
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <h2>Për Fermerët</h2>
          <p>
            Publikoni produktet tuaja dhe lidhuni drejtpërdrejt me konsumatorët
            vendas.
          </p>
        </div>
        <div className="feature">
          <h2>Për Konsumatorët</h2>
          <p>Gjeni produkte të freskëta dhe organike nga fermerët afër jush.</p>
        </div>
      </section>
    </div>
  );
}
