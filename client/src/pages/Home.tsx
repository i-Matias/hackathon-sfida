import { Link } from "react-router-dom";
import "../styles/Home.css";
import { useAuthStore } from "../stores/authStore";

export default function Home() {
  const { user } = useAuthStore();

  return (
    <div className="home-container">
      <section className="hero">
        <h1>MerrBio</h1>
        <p className="tagline">
          Produkte të freskëta, organike, dhe vendore direkt nga fermerët
        </p>
        <div className="cta-buttons">
          {user ? (
            // Show only "View Products" button when logged in
            <Link to="/products" className="cta-button">
              Shiko produktet
            </Link>
          ) : (
            // Show only login and register buttons when logged out
            <>
              <Link to="/login" className="cta-button">
                Hyr
              </Link>
              <Link to="/register" className="cta-button secondary">
                Regjistrohu
              </Link>
            </>
          )}
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
