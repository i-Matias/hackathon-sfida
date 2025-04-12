import { useState } from "react";
import { useProductStore } from "../../stores/useProductStore";
import { useAuthStore } from "../../stores/useAuthStore";

const ConsumerProducts = () => {
  const { products, addRequest } = useProductStore();
  const { email, role } = useAuthStore();
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Produkte Publike</h2>
      <input
        placeholder="Kërko..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {filtered.map((p) => (
        <div key={p.id} style={{ margin: "1rem 0" }}>
          <strong>{p.name}</strong>
          <p>{p.description}</p>
          {role === "konsumator" && (
            <button onClick={() => addRequest(p.id, email || "")}>
              Bëj kërkesë për të blerë
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ConsumerProducts;
