import { useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/Dashboard.css";
import { useProducts } from "../hooks/useProducts";
import { useRequests } from "../hooks/useRequests";
import { useLanguage } from "../contexts/LanguageContext";

interface FarmerDashboardProps {
  userId: number;
}

export default function FarmerDashboard({ userId }: FarmerDashboardProps) {
  const { useUserProducts, useDeleteProduct } = useProducts();
  const { useFarmerRequests, useUpdateRequestStatus } = useRequests();
  const { t } = useLanguage();

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

  if (isLoadingProducts && activeTab === "products")
    return (
      <div className="loading">{t("farmerDashboard.loadingProducts")}</div>
    );
  if (isLoadingRequests && activeTab === "requests")
    return (
      <div className="loading">{t("farmerDashboard.loadingRequests")}</div>
    );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>{t("farmerDashboard.title")}</h1>
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            {t("farmerDashboard.products")}
          </button>
          <button
            className={`tab-button ${activeTab === "requests" ? "active" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            {t("farmerDashboard.requests")}
            {requests.filter((r) => r.status === "pending").length > 0 && (
              <span className="notification-badge">
                {requests.filter((r) => r.status === "pending").length}
              </span>
            )}
          </button>
        </div>
        {activeTab === "products" && (
          <Link to="/farmer/add-product" className="add-button">
            {t("farmerDashboard.addProduct")}
          </Link>
        )}
      </div>

      {productsError && activeTab === "products" && (
        <div className="error-message">
          {t("farmerDashboard.errorProducts")}
        </div>
      )}
      {requestsError && activeTab === "requests" && (
        <div className="error-message">
          {t("farmerDashboard.errorRequests")}
        </div>
      )}
      {deleteMutation.error && (
        <div className="error-message">{t("farmerDashboard.errorDelete")}</div>
      )}
      {updateRequestStatusMutation.error && (
        <div className="error-message">
          {t("farmerDashboard.errorUpdateStatus")}
        </div>
      )}

      {activeTab === "products" && (
        <section className="dashboard-section">
          <h2>{t("farmerDashboard.products")}</h2>

          {products.length === 0 ? (
            <p className="no-products">{t("farmerDashboard.noProducts")}</p>
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
          <h2>{t("farmerDashboard.requests")}</h2>

          {requests.length === 0 ? (
            <p className="no-requests">{t("farmerDashboard.noRequests")}</p>
          ) : (
            <div className="requests-list">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>{t("farmerDashboard.product")}</th>
                    <th>{t("farmerDashboard.quantity")}</th>
                    <th>{t("farmerDashboard.consumer")}</th>
                    <th>{t("farmerDashboard.contact")}</th>
                    <th>{t("farmerDashboard.date")}</th>
                    <th>{t("farmerDashboard.status")}</th>
                    <th>{t("farmerDashboard.actions")}</th>
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
                              {t("farmerDashboard.approve")}
                            </button>
                            <button
                              className="reject-button"
                              onClick={() =>
                                handleStatusUpdate(request.id, "rejected")
                              }
                              disabled={updateRequestStatusMutation.isPending}
                            >
                              {t("farmerDashboard.reject")}
                            </button>
                          </>
                        )}
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
      )}
    </div>
  );
}
