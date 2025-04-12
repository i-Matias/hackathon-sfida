import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "../hooks/useTranslation";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, role } = useAuthStore();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
        >
          {isAuthenticated
            ? role === "farmer"
              ? t("farmerDashboard")
              : role === "admin"
              ? t("adminDashboard")
              : t("consumerDashboard")
            : "SFIDA"}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <LanguageSwitcher />

          {isAuthenticated ? (
            <Button color="inherit" onClick={handleLogout}>
              {t("logout")}
            </Button>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/login")}>
                {t("login")}
              </Button>
              <Button color="inherit" onClick={() => navigate("/signup")}>
                {t("signup")}
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
