import { Link } from "react-router-dom";
import "../styles/Dashboard.css";
import { useRequests } from "../hooks/useRequests";
import { useLanguage } from "../contexts/LanguageContext";

interface ConsumerDashboardProps {
  userId: number;
}

export default function ConsumerDashboard({ userId }: ConsumerDashboardProps) {
  const { useUserRequests } = useRequests();
  const { t } = useLanguage();

  const { data, isLoading, error } = useUserRequests(userId);
  const requests = data?.requests || [];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="status pending">{t("farmerDashboard.pending")}</span>
        );
      case "approved":
        return (
          <span className="status approved">
            {t("farmerDashboard.approved")}
          </span>
        );
      case "rejected":
        return (
          <span className="status rejected">
            {t("farmerDashboard.rejected")}
          </span>
        );
      default:
        return <span className="status">{status}</span>;
    }
  };

  if (isLoading) return <div className="loading">{t("loading")}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>{t("consumerDashboard.title")}</h1>
        <Link to="/products" className="add-button">
          {t("consumerDashboard.browseProducts")}
        </Link>
      </div>

      {error && (
        <div className="error-message">
          {t("consumerDashboard.errorRequests")}
        </div>
      )}

      <section className="dashboard-section">
        <h2>{t("consumerDashboard.myRequests")}</h2>

        {requests.length === 0 ? (
          <p className="no-requests">{t("consumerDashboard.noRequests")}</p>
        ) : (
          <div className="requests-list">
            <table className="requests-table">
              <thead>
                <tr>
                  <th>{t("farmerDashboard.product")}</th>
                  <th>{t("farmerDashboard.quantity")}</th>
                  <th>{t("product.farmer")}</th>
                  <th>{t("farmerDashboard.date")}</th>
                  <th>{t("farmerDashboard.status")}</th>
                  <th>{t("farmerDashboard.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request: any) => (
                  <tr key={request.id}>
                    <td>{request.product.name}</td>
                    <td>{request.quantity}</td>
                    <td>{request.product.user.username}</td>
                    <td>
                      {new Date(request.requestedAt).toLocaleDateString()}
                    </td>
                    <td>{getStatusLabel(request.status)}</td>
                    <td>
                      <Link
                        to={`/products/${request.productId}`}
                        className="view-link"
                      >
                        {t("farmerDashboard.viewProduct")}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
