import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../styles/ProductDetail.css";
import "../styles/Animation.css";
import { useProducts } from "../hooks/useProducts";
import { useRequests } from "../hooks/useRequests";
import { useLanguage } from "../contexts/LanguageContext";
import AnimatedElement from "../components/AnimatedElement";

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

  if (isLoading)
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>{t("loading")}</p>
      </div>
    );

  if (!product)
    return <div className="error-message">{t("productDetail.notFound")}</div>;

  const isOwner = user && user.role === "farmer" && product.userId === user.id;

  return (
    <AnimatedElement animation="fadeIn" duration={0.5}>
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
          <div className="success-message animate__animated animate__fadeIn">
            {t("productDetail.requestSuccess")}
          </div>
        )}

        <div className="product-detail-content card-hover">
          <div className="product-info">
            <AnimatedElement animation="fadeInDown" duration={0.5}>
              <h1>{product.name}</h1>
            </AnimatedElement>

            <AnimatedElement animation="fadeIn" delay={0.2} duration={0.5}>
              <p className="product-description">{product.description}</p>
            </AnimatedElement>

            <AnimatedElement animation="fadeInUp" delay={0.3} duration={0.5}>
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
            </AnimatedElement>

            {isOwner ? (
              <AnimatedElement animation="fadeIn" delay={0.4} duration={0.5}>
                <div className="owner-actions">
                  <Link
                    to={`/farmer/edit-product/${product.id}`}
                    className="edit-button animated-button"
                  >
                    {t("productDetail.editProduct")}
                  </Link>
                </div>
              </AnimatedElement>
            ) : user && user.role === "customer" ? (
              <AnimatedElement animation="fadeInUp" delay={0.5} duration={0.5}>
                <form onSubmit={handleRequestSubmit} className="request-form">
                  <div className="form-group">
                    <label htmlFor="quantity">
                      {t("productDetail.quantity")}:
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={product.quantity}
                      value={requestQuantity}
                      onChange={(e) =>
                        setRequestQuantity(Number(e.target.value))
                      }
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="request-button animated-button"
                    disabled={createRequestMutation.isPending}
                  >
                    {createRequestMutation.isPending
                      ? t("productDetail.sending")
                      : t("productDetail.submitRequest")}
                  </button>
                </form>
              </AnimatedElement>
            ) : (
              <AnimatedElement animation="fadeIn" delay={0.4} duration={0.5}>
                <Link
                  to="/login"
                  className="login-to-request-button animated-button"
                >
                  {t("productDetail.loginToBuy")}
                </Link>
              </AnimatedElement>
            )}
          </div>
        </div>
      </div>
    </AnimatedElement>
  );
}
