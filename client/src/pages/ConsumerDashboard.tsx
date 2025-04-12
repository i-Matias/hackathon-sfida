import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

interface Request {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  status: string;
  requestedAt: string;
  farmerName: string;
}

interface ConsumerDashboardProps {
  userId: number;
}

export default function ConsumerDashboard({ userId }: ConsumerDashboardProps) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch consumer's requests
    const fetchRequests = async () => {
      try {
        // In a real app, this would use actual API
        // const response = await fetch(`http://localhost:3000/requests?customerId=${userId}`);
        // const data = await response.json();

        // Mock data for demo
        const mockRequests = [
          {
            id: 1,
            productId: 1,
            productName: "Domate Bio",
            quantity: 5,
            status: "pending",
            requestedAt: "2025-04-13",
            farmerName: "Agron Fermer",
          },
          {
            id: 2,
            productId: 3,
            productName: "Verë Shtëpie",
            quantity: 2,
            status: "approved",
            requestedAt: "2025-04-10",
            farmerName: "Blerta Vreshtare",
          },
        ];

        setRequests(mockRequests);
      } catch (err) {
        setError("Gabim në ngarkim të kërkesave");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userId]);

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

  if (loading) return <div className="loading">Duke ngarkuar...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Paneli i Konsumatorit</h1>
        <Link to="/products" className="add-button">
          Shfletoni Produktet
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

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
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.productName}</td>
                    <td>{request.quantity}</td>
                    <td>{request.farmerName}</td>
                    <td>{request.requestedAt}</td>
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
