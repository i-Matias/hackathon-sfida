import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../styles/ProductDetail.css";
import { useProducts } from "../hooks/useProducts";
import { useRequests } from "../hooks/useRequests";
import { useLanguage } from "../contexts/LanguageContext";

interface ProductDetailProps {
  user: { id: number; role: string } | null;
}

export default function ProductDetail({ user }: ProductDetailProps) {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id) : 0;
  const [requestQuantity, setRequestQuantity] = useState(1);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { useProduct } = useProducts();
  const { useCreateRequest } = useRequests();

  const { data, isLoading, error } = useProduct(productId);
  const product = data?.product;

  const createRequestMutation = useCreateRequest();

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await createRequestMutation.mutateAsync({
        customerId: user.id,
        productId,
        quantity: requestQuantity,
        status: "pending",
      });

      setRequestSuccess(true);

      // Reset after showing success message
      setTimeout(() => {
        setRequestSuccess(false);
        setRequestQuantity(1);
      }, 3000);
    } catch (err) {
      // Error is handled by the mutation
    }
  };

  if (isLoading) return <div className="loading">{t("loading")}</div>;
  if (!product)
    return <div className="error-message">{t("productDetail.notFound")}</div>;

  const isOwner = user && user.role === "farmer" && product.userId === user.id;

  return (
    <div className="product-detail-container">
      <Link to="/products" className="back-link">
        {t("productDetail.backToProducts")}
      </Link>

      {error && (
        <div className="error-message">{t("productDetail.loadingError")}</div>
      )}
      {createRequestMutation.error && (
        <div className="error-message">{t("productDetail.requestError")}</div>
      )}
      {requestSuccess && (
        <div className="success-message">
          {t("productDetail.requestSuccess")}
        </div>
      )}

      <div className="product-detail-content">
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-description">{product.description}</p>

          <div className="product-details">
            <div className="detail-item">
              <span>{t("productDetail.price")}:</span>{" "}
              {product.price.toFixed(2)} Lek/kg
            </div>
            <div className="detail-item">
              <span>{t("productDetail.availableQuantity")}:</span>{" "}
              {product.quantity} kg
            </div>
            <div className="detail-item">
              <span>{t("product.farmer")}:</span> {product.user.username}
            </div>
          </div>

          {isOwner ? (
            <div className="owner-actions">
              <Link
                to={`/farmer/edit-product/${product.id}`}
                className="edit-button"
              >
                {t("productDetail.editProduct")}
              </Link>
            </div>
          ) : user && user.role === "customer" ? (
            <form onSubmit={handleRequestSubmit} className="request-form">
              <div className="form-group">
                <label htmlFor="quantity">{t("productDetail.quantity")}:</label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={product.quantity}
                  value={requestQuantity}
                  onChange={(e) => setRequestQuantity(Number(e.target.value))}
                  required
                />
              </div>

              <button
                type="submit"
                className="request-button"
                disabled={createRequestMutation.isPending}
              >
                {createRequestMutation.isPending
                  ? t("productDetail.sending")
                  : t("productDetail.submitRequest")}
              </button>
            </form>
          ) : (
            <Link to="/login" className="login-to-request-button">
              {t("productDetail.loginToBuy")}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
