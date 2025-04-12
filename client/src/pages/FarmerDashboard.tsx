import { useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/Dashboard.css";
import { useProducts } from "../hooks/useProducts";
import { useRequests } from "../hooks/useRequests";

interface FarmerDashboardProps {
  userId: number;
}

export default function FarmerDashboard({ userId }: FarmerDashboardProps) {
  const { useUserProducts, useDeleteProduct } = useProducts();
  const { useFarmerRequests, useUpdateRequestStatus } = useRequests();

  const [activeTab, setActiveTab] = useState("products");

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useUserProducts(userId);
  const {
    data: requestsData,
    isLoading: isLoadingRequests,
    error: requestsError,
  } = useFarmerRequests(userId);

  const products = productsData?.products || [];
  const requests = requestsData?.requests || [];

  const deleteMutation = useDeleteProduct();
  const updateRequestStatusMutation = useUpdateRequestStatus();

  const handleDelete = async (productId: number) => {
    try {
      await deleteMutation.mutateAsync(productId);
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const handleStatusUpdate = async (requestId: number, status: string) => {
    try {
      await updateRequestStatusMutation.mutateAsync({ id: requestId, status });
    } catch (err) {
      console.error("Failed to update request status:", err);
    }
  };

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

  if (isLoadingProducts && activeTab === "products")
    return <div className="loading">Duke ngarkuar produktet...</div>;
  if (isLoadingRequests && activeTab === "requests")
    return <div className="loading">Duke ngarkuar kërkesat...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Paneli i Fermerit</h1>
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Produktet e Mia
          </button>
          <button
            className={`tab-button ${activeTab === "requests" ? "active" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            Kërkesat e Blerjeve
            {requests.filter((r) => r.status === "pending").length > 0 && (
              <span className="notification-badge">
                {requests.filter((r) => r.status === "pending").length}
              </span>
            )}
          </button>
        </div>
        {activeTab === "products" && (
          <Link to="/farmer/add-product" className="add-button">
            + Shto Produkt
          </Link>
        )}
      </div>

      {productsError && activeTab === "products" && (
        <div className="error-message">Gabim në ngarkim të produkteve</div>
      )}
      {requestsError && activeTab === "requests" && (
        <div className="error-message">Gabim në ngarkim të kërkesave</div>
      )}
      {deleteMutation.error && (
        <div className="error-message">Gabim në fshirjen e produktit</div>
      )}
      {updateRequestStatusMutation.error && (
        <div className="error-message">Gabim në përditësimin e statusit</div>
      )}

      {activeTab === "products" && (
        <section className="dashboard-section">
          <h2>Produktet e Mia</h2>

          {products.length === 0 ? (
            <p className="no-products">
              Nuk keni produkte. Shtoni produkte për t'i shfaqur këtu.
            </p>
          ) : (
            <div className="products-grid">
              {products.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isOwner={true}
                  onDelete={() => handleDelete(product.id)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "requests" && (
        <section className="dashboard-section">
          <h2>Kërkesat e Blerjeve</h2>

          {requests.length === 0 ? (
            <p className="no-requests">
              Nuk keni kërkesa për blerje. Kur konsumatorët bëjnë kërkesa, do të
              shfaqen këtu.
            </p>
          ) : (
            <div className="requests-list">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Produkti</th>
                    <th>Sasia</th>
                    <th>Konsumatori</th>
                    <th>Kontakt</th>
                    <th>Data</th>
                    <th>Statusi</th>
                    <th>Veprime</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request: any) => (
                    <tr
                      key={request.id}
                      className={
                        request.status === "pending" ? "pending-row" : ""
                      }
                    >
                      <td>{request.product.name}</td>
                      <td>{request.quantity} kg</td>
                      <td>{request.customer.username}</td>
                      <td>{request.customer.email}</td>
                      <td>
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </td>
                      <td>{getStatusLabel(request.status)}</td>
                      <td className="request-actions">
                        {request.status === "pending" && (
                          <>
                            <button
                              className="approve-button"
                              onClick={() =>
                                handleStatusUpdate(request.id, "approved")
                              }
                              disabled={updateRequestStatusMutation.isPending}
                            >
                              Aprovo
                            </button>
                            <button
                              className="reject-button"
                              onClick={() =>
                                handleStatusUpdate(request.id, "rejected")
                              }
                              disabled={updateRequestStatusMutation.isPending}
                            >
                              Refuzo
                            </button>
                          </>
                        )}
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
      )}
    </div>
  );
}
