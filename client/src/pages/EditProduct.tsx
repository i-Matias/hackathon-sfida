import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import "../styles/ProductForm.css";
import { useProducts } from "../hooks/useProducts";
import { useLanguage } from "../contexts/LanguageContext";

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
  const { t } = useLanguage();

  const { useProduct, useUpdateProduct } = useProducts();
  const { data, isLoading: isLoadingProduct } = useProduct(productId);
  const updateMutation = useUpdateProduct();

  useEffect(() => {
    if (data?.product) {
      const product = data.product;

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

      setTimeout(() => {
        navigate("/farmer/dashboard");
      }, 2000);
    } catch (err) {
      // Error is handled by the mutation
    }
  };

  if (isLoadingProduct) return <div className="loading">{t("loading")}</div>;
  if (unauthorized)
    return <div className="error-message">{t("productForm.unauthorized")}</div>;

  return (
    <div className="product-form-container">
      <Link to="/farmer/dashboard" className="back-link">
        {t("productForm.backToDashboard")}
      </Link>

      <h1>{t("productForm.editTitle")}</h1>

      {updateMutation.error && (
        <div className="error-message">
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : t("productForm.updateError")}
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
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending
            ? t("productForm.updating")
            : t("productForm.updateButton")}
        </button>
      </form>
    </div>
  );
}
