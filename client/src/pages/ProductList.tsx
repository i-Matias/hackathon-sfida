import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import "../styles/ProductList.css";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  user: {
    username: string;
  };
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch all products
    const fetchProducts = async () => {
      try {
        // In a real app, this would use actual API
        // const response = await fetch("http://localhost:3000/products");
        // const data = await response.json();

        // Mock data for demo
        const mockProducts = [
          {
            id: 1,
            name: "Domate Bio",
            price: 2.5,
            quantity: 50,
            description: "Domate organike të kultivuara në Serra",
            user: { username: "Agron Fermer" },
          },
          {
            id: 2,
            name: "Ullinj",
            price: 5.0,
            quantity: 30,
            description: "Ullinj të freskët direkt nga pemët tona",
            user: { username: "Drita Ullishte" },
          },
          {
            id: 3,
            name: "Verë Shtëpie",
            price: 8.0,
            quantity: 10,
            description: "Verë e kuqe e prodhuar në shtëpi",
            user: { username: "Blerta Vreshtare" },
          },
          {
            id: 4,
            name: "Mjaltë Bio",
            price: 10.0,
            quantity: 20,
            description: "Mjaltë organike nga bletët tona",
            user: { username: "Bekim Bletari" },
          },
          {
            id: 5,
            name: "Qumësht i Freskët",
            price: 1.5,
            quantity: 40,
            description: "Qumësht i freskët nga lopët e fermës sonë",
            user: { username: "Taulant Fermer" },
          },
        ];

        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      } catch (err) {
        setError("Gabim në ngarkim të produkteve");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (!term.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.description.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredProducts(filtered);
  };

  if (loading) return <div className="loading">Duke ngarkuar...</div>;

  return (
    <div className="product-list-container">
      <h1>Produktet e Disponueshme</h1>

      <SearchBar onSearch={handleSearch} />

      {error && <div className="error-message">{error}</div>}

      {filteredProducts.length === 0 ? (
        <p className="no-products">
          {searchTerm
            ? `Nuk u gjetën produkte për "${searchTerm}"`
            : "Nuk ka produkte të disponueshme për momentin."}
        </p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} isOwner={false} />
          ))}
        </div>
      )}
    </div>
  );
}
