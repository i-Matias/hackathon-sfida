import { useState } from "react";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import "../styles/ProductList.css";
import { useProducts } from "../hooks/useProducts";

export default function ProductList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { useAllProducts } = useProducts();

  const { data, isLoading, error } = useAllProducts(searchTerm);
  const products = data?.products || [];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  if (isLoading) return <div className="loading">Duke ngarkuar...</div>;

  return (
    <div className="product-list-container">
      <h1>Produktet e Disponueshme</h1>

      <SearchBar onSearch={handleSearch} />

      {error && (
        <div className="error-message">Gabim në ngarkim të produkteve</div>
      )}

      {products.length === 0 ? (
        <p className="no-products">
          {searchTerm
            ? `Nuk u gjetën produkte për "${searchTerm}"`
            : "Nuk ka produkte të disponueshme për momentin."}
        </p>
      ) : (
        <div className="products-grid">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} isOwner={false} />
          ))}
        </div>
      )}
    </div>
  );
}
