import { useState } from "react";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import "../styles/ProductList.css";
import "../styles/Animation.css";
import { useProducts } from "../hooks/useProducts";
import { useLanguage } from "../contexts/LanguageContext";
import AnimatedElement from "../components/AnimatedElement";

export default function ProductList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { useAllProducts } = useProducts();
  const { t } = useLanguage();

  const { data, isLoading, error } = useAllProducts(searchTerm);
  const products = data?.products || [];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  if (isLoading)
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>{t("products.loading")}</p>
      </div>
    );

  return (
    <AnimatedElement animation="fadeIn" duration={0.5}>
      <div className="product-list-container">
        <h1>{t("products.title")}</h1>

        <SearchBar onSearch={handleSearch} />

        {error && <div className="error-message">{t("products.error")}</div>}

        {products.length === 0 ? (
          <p className="no-products">
            {searchTerm
              ? `${t("products.noResults")} "${searchTerm}"`
              : t("products.noProducts")}
          </p>
        ) : (
          <div className="products-grid staggered-animation">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} isOwner={false} />
            ))}
          </div>
        )}
      </div>
    </AnimatedElement>
  );
}
