import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useTranslation } from "../hooks/useTranslation";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real app, you would send this data to your backend
    // For this demo, we'll just show a success message and redirect
    if (username && email && password && role) {
      // Mock successful signup
      alert(`User registered successfully as a ${role}`);
      navigate("/login");
    } else {
      setError("Please fill in all fields");
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm">
        <Box sx={{ mt: 8 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              {t("signup")}
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
                id="username"
                label={t("username")}
                name="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={t("email")}
                name="email"
                autoComplete="email"
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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">{t("role")}</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  value={role}
                  label={t("role")}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value="farmer">{t("farmer")}</MenuItem>
                  <MenuItem value="consumer">{t("consumer")}</MenuItem>
                </Select>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {t("signup")}
              </Button>
              <Box textAlign="center">
                <Link to="/login">
                  <Typography variant="body2">{t("login")}</Typography>
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Signup;
