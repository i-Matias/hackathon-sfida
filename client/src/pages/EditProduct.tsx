import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import "../styles/ProductForm.css";
import { useProducts } from "../hooks/useProducts";

interface EditProductProps {
  userId: number;
}

export default function EditProduct({ userId }: EditProductProps) {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "0");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const navigate = useNavigate();

  const { useProduct, useUpdateProduct } = useProducts();
  const { data, isLoading: isLoadingProduct } = useProduct(productId);
  const updateMutation = useUpdateProduct();

  // Load product data when available and verify ownership
  useEffect(() => {
    if (data?.product) {
      const product = data.product;

      // Verify the product belongs to the current user
      if (product.userId !== userId) {
        setUnauthorized(true);
        return;
      }

      setName(product.name);
      setPrice(product.price.toString());
      setQuantity(product.quantity.toString());
      setDescription(product.description);
    }
  }, [data, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!name || !price || !quantity || !description) {
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: productId,
        data: {
          name,
          price: parseFloat(price),
          quantity: parseInt(quantity),
          description,
        },
      });

      setSuccess(true);

      // Reset form or redirect
      setTimeout(() => {
        navigate("/farmer/dashboard");
      }, 2000);
    } catch (err) {
      // Error is handled by the mutation
    }
  };

  if (isLoadingProduct) return <div className="loading">Duke ngarkuar...</div>;
  if (unauthorized)
    return (
      <div className="error-message">
        Ju nuk keni të drejtë të ndryshoni këtë produkt.
      </div>
    );

  return (
    <div className="product-form-container">
      <Link to="/farmer/dashboard" className="back-link">
        ← Kthehu te Paneli
      </Link>

      <h1>Ndrysho Produktin</h1>

      {updateMutation.error && (
        <div className="error-message">
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : "Gabim në përditësimin e produktit"}
        </div>
      )}

      {success && (
        <div className="success-message">Produkti u përditësua me sukses!</div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">Emri i Produktit</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="p.sh. Domate Bio"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Çmimi (€/kg)</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="p.sh. 2.50"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Sasia (kg)</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="p.sh. 50"
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Përshkrimi</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Përshkruani produktin tuaj"
            required
          />
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending
            ? "Duke përditësuar..."
            : "Përditëso Produktin"}
        </button>
      </form>
    </div>
  );
}
