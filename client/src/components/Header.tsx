import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";

interface HeaderProps {
  user: { id: number; role: string } | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/"); // Redirect to home page
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
                <Link to="/products">Produktet</Link>
              )}

              {user.role === "farmer" ? (
                <Link to="/farmer/dashboard">Paneli Im</Link>
              ) : (
                <Link to="/consumer/dashboard">Paneli Im</Link>
              )}
              <button onClick={handleLogout} className="logout-button">
                Dilni
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Hyr</Link>
              <Link to="/register">Regjistrohu</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
