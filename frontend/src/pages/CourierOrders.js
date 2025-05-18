// frontend/src/pages/CourierOrders.js
import React, { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getProducts
} from "../services/api";

export default function CourierOrders({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [productMap, setProductMap] = useState({});

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data);
    } catch (err) {
      console.error("Eroare la preluarea comenzilor pentru curier:", err);
    }
  };

  // Fetch products for name mapping
  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      const map = {};
      res.data.forEach(p => {
        map[p.ProductId] = p.Name;
      });
      setProductMap(map);
    } catch (err) {
      console.error("Eroare la încărcarea produselor:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // Map current status to next valid status
  const nextStatus = status => {
    const s = status.toLowerCase();
    if (s === "pending")    return "preparing";
    if (s === "preparing")  return "delivering";
    return null;
  };

  // Handle button click: advance or finalize (delete)
  const handleAdvance = async orderId => {
    const ord = orders.find(o => o.OrderId === orderId);
    const s = ord.Status.toLowerCase();

    try {
      if (s === "delivering") {
        // Finalize: delete order
        await deleteOrder(orderId);
      } else {
        const ns = nextStatus(ord.Status);
        if (!ns) return;
        await updateOrderStatus(orderId, ns);
      }
      // Refresh list
      await fetchOrders();
    } catch (err) {
      console.error("Eroare la actualizarea comenzii:", err);
    }
  };

  // Render
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      {/* Logout */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button
          onClick={onLogout}
          style={{ padding: "6px 12px", borderRadius: 4, backgroundColor: "#e63946", color: "#fff", border: "none", cursor: "pointer" }}
        >
          Logout
        </button>
      </div>

      <h2 style={{ textAlign: "center" }}>Panou Curier</h2>

      {orders.filter(o => ["pending","preparing","delivering"].includes(o.Status.toLowerCase())).length === 0 ? (
        <p style={{ textAlign: "center" }}>Nu există comenzi.</p>
      ) : (
        orders
          .filter(o => ["pending","preparing","delivering"].includes(o.Status.toLowerCase()))
          .map(o => (
            <div
              key={o.OrderId}
              style={{ border: "1px solid #ccc", borderRadius: 4, padding: 12, marginBottom: 12 }}
            >
              <p><strong>ID:</strong> {o.OrderId}</p>
              <p><strong>Status:</strong> {o.Status}</p>
              <p>
                <strong>Items:</strong> {o.items.map(i => (
                  `${productMap[i.ProductId] || i.ProductId}×${i.Quantity}`
                )).join(", ")}
              </p>

              <button
                onClick={() => handleAdvance(o.OrderId)}
                style={{ padding: "6px 12px", borderRadius: 4, backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer", marginTop: 8 }}
              >
                {o.Status.toLowerCase() === "pending"    && "Începe pregătirea"}
                {o.Status.toLowerCase() === "preparing"  && "Preiau comanda"}
                {o.Status.toLowerCase() === "delivering" && "Finalizează comanda"}
              </button>
            </div>
          ))
      )}
    </div>
  );
}