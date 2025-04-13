import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/ProductForm.css";
import { useProducts } from "../hooks/useProducts";
import { useLanguage } from "../contexts/LanguageContext";

interface AddProductProps {
  userId: number;
}

export default function AddProduct({ userId }: AddProductProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { useCreateProduct } = useProducts();
  const createMutation = useCreateProduct();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!name || !price || !quantity || !description) {
      return;
    }

    try {
      await createMutation.mutateAsync({
        userId,
        name,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        description,
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

  return (
    <div className="product-form-container">
      <Link to="/farmer/dashboard" className="back-link">
        {t("productForm.backToDashboard")}
      </Link>

      <h1>{t("productForm.addTitle")}</h1>

      {createMutation.error && (
        <div className="error-message">
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : t("productForm.addError")}
        </div>
      )}

      {success && (
        <div className="success-message">{t("productForm.updateSuccess")}</div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">{t("productForm.productName")}</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("productForm.productNamePlaceholder")}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">{t("productForm.price")}</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={t("productForm.pricePlaceholder")}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">{t("productForm.quantity")}</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder={t("productForm.quantityPlaceholder")}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">{t("productForm.description")}</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("productForm.descriptionPlaceholder")}
            required
          />
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending
            ? t("productForm.adding")
            : t("productForm.addButton")}
        </button>
      </form>
    </div>
  );
}
