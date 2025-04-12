import { useState } from "react";
import { useProductStore } from "../../stores/useProductStore";

interface Product {
  id: number;
  name: string;
  description: string;
}

const FarmerDashboard = () => {
  const { products, requests, addProduct, removeProduct } = useProductStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const addNew = () => {
    addProduct({ name, description });
    setName("");
    setDescription("");
  };

  return (
    <div className="container">
      <h2>Paneli i Fermerit</h2>
      <input
        placeholder="Emri i produktit"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Përshkrimi"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={addNew}>Shto produkt</button>

      {products.map((p) => (
        <div
          key={p.id}
          style={{
            marginTop: "1rem",
            background: "#fff",
            padding: "1rem",
            borderRadius: "6px",
          }}
        >
          <strong>{p.name}</strong>
          <p>{p.description}</p>
          <button
            onClick={() => removeProduct(p.id)}
            style={{ backgroundColor: "red" }}
          >
            Fshi
          </button>
        </div>
      ))}
      <h3>Kërkesat për blerje</h3>
      {requests.map((r) => {
        const prod = products.find((p) => p.id === r.productId);
        return (
          <div key={r.id}>
            <p>{`Konsumatori: ${r.consumerEmail} kërkon produktin: ${prod?.name}`}</p>
          </div>
        );
      })}
    </div>
  );
};

export default FarmerDashboard;
