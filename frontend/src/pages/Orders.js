// frontend/src/pages/Orders.js

import { useEffect, useState } from "react";
import {
  getOrdersByUser,
  createOrder,
  deleteOrder
} from "../services/api";

export default function Orders({ cart, setCart, user }) {
  const [orders, setOrders] = useState([]);

  // Încarcă comenzile existente ale utilizatorului
  const fetchOrders = async () => {
    try {
      const res = await getOrdersByUser(user.id);
      setOrders(res.data);
    } catch (err) {
      console.error("Eroare la preluarea comenzilor:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user.id]);

  // Șterge un produs din coș înainte de plasare
  const removeFromCart = index => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  // Trimite o nouă comandă
  const checkout = async () => {
    if (cart.length === 0) return;

    try {
      const payload = {
        userId:          user.id,
        deliveryAddress: user.address,
        items:           cart.map(item => ({
          productId:    item.productId,
          quantity:     item.quantity,
          pricePerUnit: item.pricePerUnit
        }))
      };

      await createOrder(payload);
      setCart([]);      // golim coșul după comandă
      fetchOrders();
    } catch (err) {
      console.error("Eroare la crearea comenzii:", err);
    }
  };

  // Șterge o comandă existentă
  const removeOrder = async orderId => {
    try {
      await deleteOrder(orderId);
      setOrders(prev => prev.filter(o => o.OrderId !== orderId));
    } catch (err) {
      console.error("Eroare la ștergerea comenzii:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Coș</h3>
      {cart.length === 0 ? (
        <p>Coșul este gol.</p>
      ) : (
        <ul>
          {cart.map((it, i) => (
            <li key={i} style={{ marginBottom: 8 }}>
              {it.name} x{it.quantity}{" "}
              <button onClick={() => removeFromCart(i)}>
                Șterge produs
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={checkout}
        disabled={cart.length === 0}
        style={{ marginTop: 10 }}
      >
        Trimite comandă
      </button>

      <hr style={{ margin: "20px 0" }} />

      <h3>Comenzi existente</h3>
      {orders.length === 0 && <p>Nu ai comenzi.</p>}
      {orders.map(o => (
        <div
          key={o.OrderId}
          style={{
            border: "1px solid #ddd",
            borderRadius: 4,
            margin: "10px 0",
            padding: 10
          }}
        >
          <p>
            <strong>ID:</strong> {o.OrderId} | <strong>Status:</strong> {o.Status} |{" "}
            <strong>Total:</strong> {o.TotalPrice} lei
          </p>
          <p><strong>Livrare la:</strong> {o.DeliveryAddress}</p>
          <p><strong>Items:</strong></p>
          <ul>
            {o.items.map(it => (
              <li key={it.ItemId}>
                { /* Afișăm numele scos la plasare (dacă îl includeți în OrderItem model) 
                     altfel Produs #id */ }
                Produs #{it.ProductId} x{it.Quantity}
              </li>
            ))}
          </ul>
          <button onClick={() => removeOrder(o.OrderId)}>
            Șterge comanda
          </button>
        </div>
      ))}
    </div>
  );
}
