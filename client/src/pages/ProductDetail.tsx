import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../styles/ProductDetail.css";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  userId: number;
  user: {
    username: string;
  };
}

interface ProductDetailProps {
  user: { id: number; role: string } | null;
}

export default function ProductDetail({ user }: ProductDetailProps) {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [requestQuantity, setRequestQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch product details
    const fetchProduct = async () => {
      try {
        // In a real app, this would use actual API
        // const response = await fetch(`http://localhost:3000/products/${id}`);
        // const data = await response.json();

        // Mock data for demo
        const mockProduct = {
          id: Number(id),
          name: "Domate Bio",
          price: 2.5,
          quantity: 50,
          description:
            "Domate organike të kultivuara në Serra. Të freskëta dhe pa pesticide, të rritura me kujdes të veçantë për të ruajtur shijen e natyrshme.",
          userId: 2,
          user: {
            username: "Agron Fermer",
          },
        };

        setProduct(mockProduct);
      } catch (err) {
        setError("Gabim në ngarkim të produktit");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      // In a real app, this would call an actual API
      // await fetch("http://localhost:3000/requests", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     customerId: user.id,
      //     productId: product?.id,
      //     quantity: requestQuantity,
      //     status: "pending"
      //   }),
      // });

      setRequestSuccess(true);

      // Reset after showing success message
      setTimeout(() => {
        setRequestSuccess(false);
        setRequestQuantity(1);
      }, 3000);
    } catch (err) {
      setError("Gabim në dërgimin e kërkesës");
    }
  };

  if (loading) return <div className="loading">Duke ngarkuar...</div>;
  if (!product) return <div className="error-message">Produkti nuk u gjet</div>;

  const isOwner = user && user.role === "farmer" && product.userId === user.id;

  return (
    <div className="product-detail-container">
      <Link to="/products" className="back-link">
        ← Kthehu te produktet
      </Link>

      {error && <div className="error-message">{error}</div>}
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

              <button type="submit" className="request-button">
                Dërgo Kërkesën për Blerje
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
