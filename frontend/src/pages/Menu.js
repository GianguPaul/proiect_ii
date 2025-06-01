// frontend/src/pages/Menu.js

import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Menu({ onAddToCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Eroare la încărcare produse:", err));
  }, []);

  // Grupează produsele după categorie
  const groupedByCategory = products.reduce((acc, product) => {
    const cat = product.Category || "Altele";
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(product);
    return acc;
  }, {});

  // Ordine preferențială a categoriilor
  const categoryOrder = [
    "Pizza",
    "Burger",
    "Salad",
    "Ciorba",
    "Paste",
    "Traditional",
    "Desert",
    "Racoritoare",
  ];

  // Construiește lista finală de categorii în ordinea dorită + rest
  const allCategories = [
    ...categoryOrder.filter((c) => groupedByCategory[c]),
    ...Object.keys(groupedByCategory)
      .filter((c) => !categoryOrder.includes(c))
      .sort(),
  ];

  // Funcție pentru scroll to top (smooth)
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ padding: "0 20px", marginTop: "20px" }}>
      {/** ─────────────── Anchor pentru butonul „Sus” ─────────────── **/}
      <div id="top"></div>

      {/** ─────────────── Bara de categorii lipită sus + buton „Sus” ─────────────── **/}
      <div
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "#ffffff",
          zIndex: 10,
          padding: "10px 0",
          borderBottom: "1px solid #ddd",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "10px",
            alignItems: "center",
          }}
        >
          {allCategories.map((category) => (
            <a
              key={category}
              href={`#${category}`}
              style={{
                padding: "8px 16px",
                backgroundColor: "#ffcc00",
                color: "#000",
                borderRadius: 4,
                textDecoration: "none",
                fontWeight: "bold",
                border: "1px solid #e6b800",
              }}
            >
              {category}
            </a>
          ))}

          {/* ─── Butonul „Sus” ─── */}
          <button
            onClick={scrollToTop}
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "#fff",
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              marginLeft: "10px",
            }}
          >
            Sus
          </button>
        </div>
      </div>

      {/** ─────────────── Secțiuni produse pe categorii ─────────────── **/}
      {allCategories.map((category) => (
        <div key={category} style={{ marginBottom: "40px" }}>
          <h3
            id={category}
            style={{
              textAlign: "left",
              margin: "20px 0 10px",
              fontSize: "1.4em",
              borderBottom: "2px solid #ddd",
              paddingBottom: "8px",
              // scrollMarginTop adaugă un offset de 80px înainte de titlu, ca să nu fie acoperit
              scrollMarginTop: "80px",
            }}
          >
            {category}
          </h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            {groupedByCategory[category].map((p) => (
              <div
                key={p.ProductId}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  padding: "10px",
                  width: "200px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                {/* ─── Imagine produs ─── */}
                {p.ImageUrl ? (
                  <img
                    src={p.ImageUrl}
                    alt={p.Name}
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 4,
                      marginBottom: 8,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: 120,
                      backgroundColor: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#888",
                      marginBottom: 8,
                    }}
                  >
                    (fără poză)
                  </div>
                )}

                {/** Nume, descriere, preț **/}
                <div style={{ flexGrow: 1 }}>
                  <h4
                    style={{
                      margin: "0 0 8px",
                      textAlign: "center",
                      fontSize: "1.1em",
                    }}
                  >
                    {p.Name}
                  </h4>
                  <p style={{ margin: "0 0 8px", fontSize: "0.9em" }}>
                    {p.Description}
                  </p>
                  <p style={{ margin: "0 0 12px", fontWeight: "bold" }}>
                    {p.Price} lei
                  </p>
                </div>

                {/** Buton „Adaugă în coș” **/}
                <button
                  onClick={() =>
                    onAddToCart({
                      productId:    p.ProductId,
                      name:         p.Name,
                      description:  p.Description,
                      imageUrl:     p.ImageUrl,
                      quantity:     1,
                      pricePerUnit: p.Price,
                    })
                  }
                  disabled={!p.IsAvailable}
                  style={{
                    padding: "8px",
                    borderRadius: 4,
                    cursor: p.IsAvailable ? "pointer" : "not-allowed",
                    backgroundColor: p.IsAvailable ? "#ffcc00" : "#ccc",
                    color: "#000",
                    border: "none",
                    marginTop: 8,
                    fontWeight: "bold",
                  }}
                >
                  {p.IsAvailable ? "Adaugă în coș" : "Indisponibil"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
