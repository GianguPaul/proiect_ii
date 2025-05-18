import { useEffect, useState } from "react";
import api from "../services/api";

export default function Menu({ onAddToCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api
      .get("/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error("Eroare la încărcare produse:", err));
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "20px",
        padding: "0 20px"
      }}
    >
      {products.map(p => (
        <div
          key={p.ProductId}
          style={{
            border: "1px solid #ccc",
            borderRadius: 4,
            padding: "10px",
            width: "200px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          {p.ImageUrl && (
            <img
              src={p.ImageUrl}
              alt={p.Name}
              style={{
                width: "100%",
                height: 120,
                objectFit: "cover",
                borderRadius: 4,
                marginBottom: 8
              }}
            />
          )}
          <div style={{ flexGrow: 1 }}>
            <h3 style={{ margin: "0 0 8px", textAlign: "center" }}>{p.Name}</h3>
            <p style={{ margin: "0 0 8px", fontSize: "0.9em" }}>
              {p.Description}
            </p>
            <p style={{ margin: "0 0 12px", fontWeight: "bold" }}>
              {p.Price} lei
            </p>
          </div>
          <button
            onClick={() =>
              onAddToCart({
                productId:    p.ProductId,
                name:         p.Name,
                description:  p.Description,
                imageUrl:     p.ImageUrl,
                quantity:     1,
                pricePerUnit: p.Price
              })
            }
            disabled={!p.IsAvailable}
            style={{
              padding: "8px",
              borderRadius: 4,
              cursor: p.IsAvailable ? "pointer" : "not-allowed",
              backgroundColor: p.IsAvailable ? "#007bff" : "#ccc",
              color: "#fff",
              border: "none",
              marginTop: 8
            }}
          >
            {p.IsAvailable ? "Adaugă în coș" : "Indisponibil"}
          </button>
        </div>
      ))}
    </div>
  );
}
