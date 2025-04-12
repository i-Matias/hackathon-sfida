import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/Dashboard.css";
import { useProducts } from "../hooks/useProducts";

interface FarmerDashboardProps {
  userId: number;
}

export default function FarmerDashboard({ userId }: FarmerDashboardProps) {
  const { useUserProducts, useDeleteProduct } = useProducts();

  const { data, isLoading, error } = useUserProducts(userId);
  const products = data?.products || [];

  const deleteMutation = useDeleteProduct();

  const handleDelete = async (productId: number) => {
    try {
      await deleteMutation.mutateAsync(productId);
    } catch (err) {
      // Error handling can be improved
      console.error("Failed to delete product:", err);
    }
  };

  if (isLoading) return <div className="loading">Duke ngarkuar...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Paneli i Fermerit</h1>
        <Link to="/farmer/add-product" className="add-button">
          + Shto Produkt
        </Link>
      </div>

      {error && (
        <div className="error-message">Gabim në ngarkim të produkteve</div>
      )}
      {deleteMutation.error && (
        <div className="error-message">Gabim në fshirjen e produktit</div>
      )}

      <section className="dashboard-section">
        <h2>Produktet e Mia</h2>

        {products.length === 0 ? (
          <p className="no-products">
            Nuk keni produkte. Shtoni produkte për t'i shfaqur këtu.
          </p>
        ) : (
          <div className="products-grid">
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                isOwner={true}
                onDelete={() => handleDelete(product.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
