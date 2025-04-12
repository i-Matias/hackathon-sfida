import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/Dashboard.css";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
}

interface FarmerDashboardProps {
  userId: number;
}

export default function FarmerDashboard({ userId }: FarmerDashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch farmer's products
    const fetchProducts = async () => {
      try {
        // In a real app, this would use actual API
        // const response = await fetch(`http://localhost:3000/products/user?userId=${userId}`);
        // const data = await response.json();

        // Mock data for demo
        const mockProducts = [
          {
            id: 1,
            name: "Domate Bio",
            price: 2.5,
            quantity: 50,
            description: "Domate organike të kultivuara në Serra",
          },
          {
            id: 2,
            name: "Ullinj",
            price: 5.0,
            quantity: 30,
            description: "Ullinj të freskët direkt nga pemët tona",
          },
          {
            id: 3,
            name: "Verë Shtëpie",
            price: 8.0,
            quantity: 10,
            description: "Verë e kuqe e prodhuar në shtëpi",
          },
        ];

        setProducts(mockProducts);
      } catch (err) {
        setError("Gabim në ngarkim të produkteve");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [userId]);

  const handleDelete = async (productId: number) => {
    try {
      // In a real app, this would call an actual API
      // await fetch(`http://localhost:3000/products/${productId}`, {
      //   method: "DELETE",
      // });

      // Update UI by removing the deleted product
      setProducts(products.filter((product) => product.id !== productId));
    } catch (err) {
      setError("Gabim në fshirjen e produktit");
    }
  };

  if (loading) return <div className="loading">Duke ngarkuar...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Paneli i Fermerit</h1>
        <Link to="/farmer/add-product" className="add-button">
          + Shto Produkt
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <section className="dashboard-section">
        <h2>Produktet e Mia</h2>

        {products.length === 0 ? (
          <p className="no-products">
            Nuk keni produkte. Shtoni produkte për t'i shfaqur këtu.
          </p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
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
