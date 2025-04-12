import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../styles/ProductDetail.css";
import { useProducts } from "../hooks/useProducts";
import { useRequests } from "../hooks/useRequests";

interface ProductDetailProps {
  user: { id: number; role: string } | null;
}

export default function ProductDetail({ user }: ProductDetailProps) {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id) : 0;
  const [requestQuantity, setRequestQuantity] = useState(1);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const navigate = useNavigate();

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

  if (isLoading) return <div className="loading">Duke ngarkuar...</div>;
  if (!product) return <div className="error-message">Produkti nuk u gjet</div>;

  const isOwner = user && user.role === "farmer" && product.userId === user.id;

  return (
    <div className="product-detail-container">
      <Link to="/products" className="back-link">
        ← Kthehu te produktet
      </Link>

      {error && (
        <div className="error-message">Gabim në ngarkim të produktit</div>
      )}
      {createRequestMutation.error && (
        <div className="error-message">Gabim në dërgimin e kërkesës</div>
      )}
      {requestSuccess && (
        <div className="success-message">
          Kërkesa juaj u dërgua me sukses! Fermeri do të përgjigjet së shpejti.
        </div>
      )}

      <div className="product-detail-content">
        <div className="product-image-placeholder">
          <span>Fotoja e Produktit</span>
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-description">{product.description}</p>

          <div className="product-details">
            <div className="detail-item">
              <span>Çmimi:</span> {product.price.toFixed(2)} €/kg
            </div>
            <div className="detail-item">
              <span>Sasia e Disponueshme:</span> {product.quantity} kg
            </div>
            <div className="detail-item">
              <span>Fermeri:</span> {product.user.username}
            </div>
          </div>

          {isOwner ? (
            <div className="owner-actions">
              <Link
                to={`/farmer/edit-product/${product.id}`}
                className="edit-button"
              >
                Ndrysho Produktin
              </Link>
            </div>
          ) : user && user.role === "customer" ? (
            <form onSubmit={handleRequestSubmit} className="request-form">
              <div className="form-group">
                <label htmlFor="quantity">Sasia (kg):</label>
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
                  ? "Duke dërguar..."
                  : "Dërgo Kërkesën për Blerje"}
              </button>
            </form>
          ) : (
            <Link to="/login" className="login-to-request-button">
              Identifikohu për të Blerë
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
