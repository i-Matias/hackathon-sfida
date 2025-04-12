import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { useAuthStore } from "../stores/authStore";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const navigate = useNavigate();

  const { register, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!username || !email || !password) {
      return; // Form validation should handle this
    }

    try {
      await register({
        userName: username,
        email,
        password,
        roleId: role === "farmer" ? 1 : 2,
      });

      // Navigate based on role
      navigate(role === "farmer" ? "/farmer/dashboard" : "/consumer/dashboard");
    } catch (err) {
      // Error is handled in the store
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Regjistrohu në MerrBio</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Emri i përdoruesit</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Emri juaj"
              required
            />
          </div>

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

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Duke u regjistruar..." : "Regjistrohu"}
          </button>
        </form>

        <p className="auth-redirect">
          Keni tashmë një llogari? <Link to="/login">Hyr</Link>
        </p>
      </div>
    </div>
  );
}
