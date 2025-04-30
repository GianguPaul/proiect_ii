import { useEffect, useState } from "react";
import api from "../services/api";

export default function Menu({ onAddToCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products").then(res => setProducts(res.data));
  }, []);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      {products.map(p => (
        <div key={p.ProductId} style={{ border: "1px solid #ccc", padding: "10px", width: "200px" }}>
          <h3>{p.Name}</h3>
          <p>{p.Description}</p>
          <p>{p.Price} lei</p>
          <button onClick={() => onAddToCart({ ...p, quantity: 1, pricePerUnit: p.Price })}>
            Adaugă în coș
          </button>
        </div>
      ))}
    </div>
  );
}
