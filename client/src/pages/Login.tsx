import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

interface LoginProps {
  onLogin: (user: { id: number; role: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // In a real app, this would call an actual API
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          roleId: role === "farmer" ? 1 : 2,
        }),
      });

      // Mock successful login for demo purpose
      if (email && password) {
        const user = {
          id: 1,
          role: role,
        };

        onLogin(user);
        navigate(
          role === "farmer" ? "/farmer/dashboard" : "/consumer/dashboard"
        );
      } else {
        setError("Të gjitha fushat janë të detyrueshme");
      }
    } catch (err) {
      setError("Gabim në hyrje. Ju lutemi provoni përsëri.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Hyr në MerrBio</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juaji@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Fjalëkalimi</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Fjalëkalimi juaj"
              required
            />
          </div>

          <div className="form-group">
            <label>Roli</label>
            <div className="role-selection">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="farmer"
                  checked={role === "farmer"}
                  onChange={() => setRole("farmer")}
                />
                Fermer
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={role === "customer"}
                  onChange={() => setRole("customer")}
                />
                Konsumator
              </label>
            </div>
          </div>

          <button type="submit" className="auth-button">
            Hyr
          </button>
        </form>

        <p className="auth-redirect">
          Nuk keni një llogari? <Link to="/register">Regjistrohu</Link>
        </p>
      </div>
    </div>
  );
}
