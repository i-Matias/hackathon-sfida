import { Link } from "react-router-dom";
import "../styles/Dashboard.css";
import { useRequests } from "../hooks/useRequests";

interface ConsumerDashboardProps {
  userId: number;
}

export default function ConsumerDashboard({ userId }: ConsumerDashboardProps) {
  const { useUserRequests } = useRequests();

  const { data, isLoading, error } = useUserRequests(userId);
  const requests = data?.requests || [];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="status pending">Në pritje</span>;
      case "approved":
        return <span className="status approved">Aprovuar</span>;
      case "rejected":
        return <span className="status rejected">Refuzuar</span>;
      default:
        return <span className="status">{status}</span>;
    }
  };

  if (isLoading) return <div className="loading">Duke ngarkuar...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Paneli i Konsumatorit</h1>
        <Link to="/products" className="add-button">
          Shfletoni Produktet
        </Link>
      </div>

      {error && (
        <div className="error-message">Gabim në ngarkim të kërkesave</div>
      )}

      <section className="dashboard-section">
        <h2>Kërkesat e Mia</h2>

        {requests.length === 0 ? (
          <p className="no-requests">
            Nuk keni kërkesa aktive. Shfletoni produktet për të bërë kërkesa.
          </p>
        ) : (
          <div className="requests-list">
            <table className="requests-table">
              <thead>
                <tr>
                  <th>Produkti</th>
                  <th>Sasia</th>
                  <th>Fermeri</th>
                  <th>Data</th>
                  <th>Statusi</th>
                  <th>Veprime</th>
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
                        Shiko Produktin
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
