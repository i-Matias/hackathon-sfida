import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import { useAuthStore } from "../stores/authStore";
import { useProfile } from "../hooks/useProfile";
import { useLanguage } from "../contexts/LanguageContext";

export default function Profile() {
  const { user } = useAuthStore();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { useUserProfile } = useProfile();
  const { data, isLoading } = useUserProfile(user?.id || 0);

  useEffect(() => {
    if (data?.user) {
      setUsername(data.user.username);
      setEmail(data.user.email);
    }
  }, [data]);

  if (isLoading) return <div className="loading">{t("loading")}</div>;
  if (!user) return <div>{t("profile.notFound")}</div>;

  return (
    <div className="profile-container">
      <h1>{t("profile.title")}</h1>

      <div className="profile-card">
        <div className="profile-form read-only">
          <div className="form-section">
            <h2>{t("profile.personalInfo")}</h2>

            <div className="profile-field">
              <label>{t("profile.username")}:</label>
              <div className="field-value">{username}</div>
            </div>

            <div className="profile-field">
              <label>{t("profile.email")}:</label>
              <div className="field-value">{email}</div>
            </div>

            <div className="role-info">
              <span className="role-label">{t("profile.role")}:</span>
              <span className="role-value">
                {user.roleId === 1 ? t("auth.farmer") : t("auth.customer")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
