import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";
import "../styles/AdminDashboard.css";
import { useAdmin } from "../hooks/useAdmin";
import { useLanguage } from "../contexts/LanguageContext";

interface AdminDashboardProps {
  userId: number;
}

export default function AdminDashboard({ userId }: AdminDashboardProps) {
  const {
    useUsers,
    useDeleteUser,
    useAdminProducts,
    useDeleteProductAdmin,
    useAdminRequests,
    useUpdateRequestStatusAdmin,
    useAdminStats,
  } = useAdmin();

  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  // Fetch data using the React Query hooks
  const { data: usersData, isLoading: isLoadingUsers } = useUsers();
  const { data: productsData, isLoading: isLoadingProducts } =
    useAdminProducts();
  const { data: requestsData, isLoading: isLoadingRequests } =
    useAdminRequests();
  const { data: statsData, isLoading: isLoadingStats } = useAdminStats();

  const users = usersData?.users || [];
  const products = productsData?.products || [];
  const requests = requestsData?.requests || [];
  const stats = statsData?.stats || {
    totalUsers: 0,
    totalFarmers: 0,
    totalCustomers: 0,
    totalProducts: 0,
    pendingRequests: 0,
  };

  // Mutations
  const deleteUserMutation = useDeleteUser();
  const deleteProductMutation = useDeleteProductAdmin();
  const updateRequestStatusMutation = useUpdateRequestStatusAdmin();

  // Handlers
  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUserMutation.mutateAsync(userId);
      setConfirmDelete(null);
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await deleteProductMutation.mutateAsync(productId);
      setConfirmDelete(null);
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
          <span className="status pending">
            {t("farmerDashboard.pending") || "Pending"}
          </span>
        );
      case "approved":
        return (
          <span className="status approved">
            {t("farmerDashboard.approved") || "Approved"}
          </span>
        );
      case "rejected":
        return (
          <span className="status rejected">
            {t("farmerDashboard.rejected") || "Rejected"}
          </span>
        );
      default:
        return <span className="status">{status}</span>;
    }
  };

  const getRoleName = (roleId: number) => {
    switch (roleId) {
      case 1:
        return t("auth.farmer") || "Farmer";
      case 2:
        return t("auth.customer") || "Customer";
      case 3:
        return t("admin.adminRole") || "Admin";
      default:
        return "Unknown";
    }
  };

  // Loading states
  if (isLoadingStats && activeTab === "overview")
    return (
      <div className="loading">
        {t("admin.loadingStats") || "Loading statistics..."}
      </div>
    );

  if (isLoadingUsers && activeTab === "users")
    return (
      <div className="loading">
        {t("admin.loadingUsers") || "Loading users..."}
      </div>
    );

  if (isLoadingProducts && activeTab === "products")
    return (
      <div className="loading">
        {t("admin.loadingProducts") || "Loading products..."}
      </div>
    );

  if (isLoadingRequests && activeTab === "requests")
    return (
      <div className="loading">
        {t("admin.loadingRequests") || "Loading requests..."}
      </div>
    );

  return (
    <div className="dashboard-container admin-dashboard">
      <div className="dashboard-header admin-header">
        <h1>{t("admin.dashboardTitle") || "Admin Dashboard"}</h1>
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            {t("admin.overview") || "Overview"}
          </button>
          <button
            className={`tab-button ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            {t("admin.products") || "Products"}
          </button>
          <button
            className={`tab-button ${activeTab === "requests" ? "active" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            {t("admin.requests") || "Requests"}
            {stats.pendingRequests > 0 && (
              <span className="notification-badge">
                {stats.pendingRequests}
              </span>
            )}
          </button>
          <button
            className={`tab-button ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            {t("admin.users") || "Users"}
          </button>
        </div>
      </div>

      {/* Show errors if any */}
      {deleteUserMutation.error && (
        <div className="error-message">
          {t("admin.errorDeleteUser") || "Failed to delete user."}
        </div>
      )}
      {deleteProductMutation.error && (
        <div className="error-message">
          {t("admin.errorDeleteProduct") || "Failed to delete product."}
        </div>
      )}
      {updateRequestStatusMutation.error && (
        <div className="error-message">
          {t("admin.errorUpdateStatus") || "Failed to update request status."}
        </div>
      )}

      {activeTab === "overview" && (
        <section className="dashboard-section admin-overview">
          <h2>{t("admin.statistics") || "Statistics"}</h2>
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <h3>{t("admin.totalFarmers") || "Total Farmers"}</h3>
              <p className="stat-number">{stats.totalFarmers}</p>
            </div>
            <div className="admin-stat-card">
              <h3>{t("admin.totalCustomers") || "Total Customers"}</h3>
              <p className="stat-number">{stats.totalCustomers}</p>
            </div>
            <div className="admin-stat-card">
              <h3>{t("admin.totalProducts") || "Total Products"}</h3>
              <p className="stat-number">{stats.totalProducts}</p>
            </div>
            <div className="admin-stat-card">
              <h3>{t("admin.pendingRequests") || "Pending Requests"}</h3>
              <p className="stat-number">{stats.pendingRequests}</p>
            </div>
          </div>
        </section>
      )}

      {activeTab === "products" && (
        <section className="dashboard-section">
          <h2>{t("admin.allProducts") || "All Products"}</h2>

          {products.length === 0 ? (
            <p className="no-products">
              {t("admin.noProducts") || "No products available"}
            </p>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{t("product.name") || "Name"}</th>
                    <th>{t("product.price") || "Price"}</th>
                    <th>{t("product.quantity") || "Quantity"}</th>
                    <th>{t("product.farmer") || "Farmer"}</th>
                    <th>{t("admin.actions") || "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product: any) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>${product.price}</td>
                      <td>{product.quantity} kg</td>
                      <td>{product.user?.username || "Unknown"}</td>
                      <td className="admin-actions">
                        <Link
                          to={`/products/${product.id}`}
                          className="view-button"
                        >
                          {t("admin.view") || "View"}
                        </Link>
                        {confirmDelete === product.id ? (
                          <>
                            <button
                              className="confirm-button"
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={deleteProductMutation.isPending}
                            >
                              {t("admin.confirmDelete") || "Confirm"}
                            </button>
                            <button
                              className="cancel-button"
                              onClick={() => setConfirmDelete(null)}
                            >
                              {t("admin.cancel") || "Cancel"}
                            </button>
                          </>
                        ) : (
                          <button
                            className="delete-button"
                            onClick={() => setConfirmDelete(product.id)}
                          >
                            {t("admin.delete") || "Delete"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {activeTab === "requests" && (
        <section className="dashboard-section">
          <h2>{t("admin.allRequests") || "All Requests"}</h2>

          {requests.length === 0 ? (
            <p className="no-requests">
              {t("admin.noRequests") || "No requests available"}
            </p>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{t("farmerDashboard.product") || "Product"}</th>
                    <th>{t("farmerDashboard.quantity") || "Quantity"}</th>
                    <th>{t("farmerDashboard.consumer") || "Customer"}</th>
                    <th>{t("product.farmer") || "Farmer"}</th>
                    <th>{t("farmerDashboard.date") || "Date"}</th>
                    <th>{t("farmerDashboard.status") || "Status"}</th>
                    <th>{t("admin.actions") || "Actions"}</th>
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
                      <td>{request.id}</td>
                      <td>{request.product?.name || "Unknown"}</td>
                      <td>{request.quantity} kg</td>
                      <td>{request.customer?.username || "Unknown"}</td>
                      <td>{request.product?.user?.username || "Unknown"}</td>
                      <td>
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </td>
                      <td>{getStatusLabel(request.status)}</td>
                      <td className="admin-actions">
                        <Link
                          to={`/products/${request.productId}`}
                          className="view-button"
                        >
                          {t("admin.viewProduct") || "View Product"}
                        </Link>
                        {request.status === "pending" && (
                          <>
                            <button
                              className="approve-button"
                              onClick={() =>
                                handleStatusUpdate(request.id, "approved")
                              }
                              disabled={updateRequestStatusMutation.isPending}
                            >
                              {t("farmerDashboard.approve") || "Approve"}
                            </button>
                            <button
                              className="reject-button"
                              onClick={() =>
                                handleStatusUpdate(request.id, "rejected")
                              }
                              disabled={updateRequestStatusMutation.isPending}
                            >
                              {t("farmerDashboard.reject") || "Reject"}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {activeTab === "users" && (
        <section className="dashboard-section">
          <h2>{t("admin.allUsers") || "All Users"}</h2>

          {users.length === 0 ? (
            <p className="no-users">
              {t("admin.noUsers") || "No users available"}
            </p>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{t("auth.username") || "Username"}</th>
                    <th>{t("auth.email") || "Email"}</th>
                    <th>{t("auth.role") || "Role"}</th>
                    <th>{t("admin.actions") || "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{getRoleName(user.roleId)}</td>
                      <td className="admin-actions">
                        {userId !== user.id && user.roleId !== 3 ? (
                          confirmDelete === user.id ? (
                            <>
                              <button
                                className="confirm-button"
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={deleteUserMutation.isPending}
                              >
                                {t("admin.confirmDelete") || "Confirm"}
                              </button>
                              <button
                                className="cancel-button"
                                onClick={() => setConfirmDelete(null)}
                              >
                                {t("admin.cancel") || "Cancel"}
                              </button>
                            </>
                          ) : (
                            <button
                              className="delete-button"
                              onClick={() => setConfirmDelete(user.id)}
                            >
                              {t("admin.delete") || "Delete"}
                            </button>
                          )
                        ) : (
                          <span className="admin-no-action">
                            {user.roleId === 3
                              ? t("admin.cannotDeleteAdmin") || "Admin account"
                              : t("admin.yourAccount") || "Your account"}
                          </span>
                        )}
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
