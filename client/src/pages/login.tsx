import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import Navbar from "../components/Navbar";
import { useTranslation } from "../hooks/useTranslation";

// Mock users for demonstration
const mockUsers = [
  {
    id: 1,
    username: "farmer1",
    email: "farmer@example.com",
    password: "password",
    role: "farmer",
  },
  {
    id: 2,
    username: "consumer1",
    email: "consumer@example.com",
    password: "password",
    role: "consumer",
  },
  {
    id: 3,
    username: "admin",
    email: "admin@example.com",
    password: "password",
    role: "admin",
  },
];

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple mock authentication
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Remove password before storing in state
      const { password, ...userData } = user;
      login(userData);
      navigate("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm">
        <Box sx={{ mt: 8 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              {t("login")}
            </Typography>

            {error && (
              <Typography color="error" align="center" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={t("email")}
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={t("password")}
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {t("login")}
              </Button>
              <Box textAlign="center">
                <Link to="/signup">
                  <Typography variant="body2">{t("signup")}</Typography>
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Login;
