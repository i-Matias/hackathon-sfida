import { Link } from "react-router-dom";
import "../styles/ProductCard.css";
import { useLanguage } from "../contexts/LanguageContext";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  user?: {
    username: string;
  };
}

interface ProductCardProps {
  product: Product;
  isOwner: boolean;
  onDelete?: (id: number) => void;
}

export default function ProductCard({
  product,
  isOwner,
  onDelete,
}: ProductCardProps) {
  const { t } = useLanguage();

  const truncateDescription = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="product-card">
      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">
          {truncateDescription(product.description)}
        </p>

        <div className="product-details">
          <span className="product-price">{product.price.toFixed(2)} Lek/kg</span>
          <span className="product-quantity">
            {t("product.quantity")}: {product.quantity} kg
          </span>
          {product.user && (
            <span className="product-farmer">
              {t("product.farmer")}: {product.user.username}
            </span>
          )}
        </div>

        <div className="product-actions">
          <Link to={`/products/${product.id}`} className="view-button">
            {t("product.viewDetails")}
          </Link>

          {isOwner && onDelete && (
            <button
              className="delete-button"
              onClick={() => onDelete(product.id)}
            >
              {t("product.delete")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
