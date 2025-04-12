import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/ProductForm.css";

interface AddProductProps {
  userId: number;
}

export default function AddProduct({ userId }: AddProductProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!name || !price || !quantity || !description) {
      setError("Të gjitha fushat janë të detyrueshme");
      return;
    }

    try {
      // In a real app, this would call an actual API
      // await fetch("http://localhost:3000/products", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     userId,
      //     name,
      //     price: parseFloat(price),
      //     quantity: parseInt(quantity),
      //     description,
      //   }),
      // });

      setSuccess(true);

      // Reset form or redirect
      setTimeout(() => {
        navigate("/farmer/dashboard");
      }, 2000);
    } catch (err) {
      setError("Gabim në shtimin e produktit");
    }
  };

  return (
    <div className="product-form-container">
      <Link to="/farmer/dashboard" className="back-link">
        ← Kthehu te Paneli
      </Link>

      <h1>Shto Produkt të Ri</h1>

      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">Produkti u shtua me sukses!</div>
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

        <button type="submit" className="submit-button">
          Shto Produktin
        </button>
      </form>
    </div>
  );
}
