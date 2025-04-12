import React from "react";
import { useLanguageStore } from "../stores/useLanguageStore";
import { useTranslation } from "../hooks/useTranslation";
import { Button, Box } from "@mui/material";

const LanguageSwitcher: React.FC = () => {
  const { setLanguage } = useLanguageStore();
  const { t, language } = useTranslation();

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Button
        variant={language === "en" ? "contained" : "outlined"}
        onClick={() => setLanguage("en")}
        size="small"
      >
        {t("english")}
      </Button>
      <Button
        variant={language === "sq" ? "contained" : "outlined"}
        onClick={() => setLanguage("sq")}
        size="small"
      >
        {t("albanian")}
      </Button>
    </Box>
  );
};

export default LanguageSwitcher;
