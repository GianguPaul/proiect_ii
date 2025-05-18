import { useEffect, useState } from "react";
import {
  getOrdersByUser,
  createOrder,
  deleteOrder
} from "../services/api";
import api from "../services/api";

export default function Orders({ cart, setCart, user }) {
  const [orders, setOrders] = useState([]);
  const [productMap, setProductMap] = useState({});

  // Încarcă lista de produse pentru maparea ID→Nume
  useEffect(() => {
    api.get("/products")
      .then(res => {
        const map = {};
        res.data.forEach(p => { map[p.ProductId] = p.Name; });
        setProductMap(map);
      })
      .catch(err => console.error("Eroare la încărcare produse:", err));
  }, []);

  // Fetch comenzi existente
  const fetchOrders = async () => {
    try {
      const res = await getOrdersByUser(user.id);
      setOrders(res.data);
    } catch (err) {
      console.error("Eroare la preluarea comenzilor:", err);
    }
  };

  useEffect(() => { fetchOrders(); }, [user.id]);

  // Plasează comanda
  const checkout = async () => {
    if (cart.length === 0) return;
    try {
      await createOrder({
        userId: user.id,
        deliveryAddress: user.address,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          pricePerUnit: item.pricePerUnit
        }))
      });
      setCart([]);
      fetchOrders();
    } catch (err) {
      console.error("Eroare la crearea comenzii:", err);
    }
  };

  // Șterge o comandă
  const removeOrder = async orderId => {
    try {
      await deleteOrder(orderId);
      setOrders(prev => prev.filter(o => o.OrderId !== orderId));
    } catch (err) {
      console.error("Eroare la ștergerea comenzii:", err);
    }
  };

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Coș */}
      <h3 style={{ textAlign: "center" }}>Coș</h3>
      {cart.length === 0 ? (
        <p style={{ textAlign: "center" }}>Coșul este gol.</p>
      ) : (
        <table style={{ width: "100%", maxWidth: 600, borderCollapse: "collapse", marginBottom: 20 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 8 }}>Produs</th>
              <th style={{ textAlign: "center", padding: 8 }}>Cantitate</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.productId} style={{ borderTop: "1px solid #ddd" }}>
                <td style={{ padding: 8 }}>{productMap[item.productId] || item.name}</td>
                <td style={{ padding: 8, textAlign: "center" }}>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {cart.length > 0 && (
        <button onClick={checkout} style={{ padding: "8px 16px", borderRadius: 4, backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer", marginBottom: 20 }}>
          Trimite comandă
        </button>
      )}

      <hr style={{ width: "100%", maxWidth: 600, margin: "20px 0" }} />

      {/* Comenzi existente */}
      <h3 style={{ textAlign: "center" }}>Comenzi existente</h3>
      {orders.length === 0 ? (
        <p style={{ textAlign: "center" }}>Nu ai comenzi.</p>
      ) : (
        orders.map(o => (
          <div key={o.OrderId} style={{ border: "1px solid #ddd", borderRadius: 4, width: "100%", maxWidth: 600, margin: "10px 0", padding: 10 }}>
            <p style={{ textAlign: "center" }}>
              <strong>ID:</strong> {o.OrderId} | <strong>Status:</strong> {o.Status} | <strong>Total:</strong> {o.TotalPrice} lei
            </p>
            <p style={{ textAlign: "center" }}><strong>Livrare la:</strong> {o.DeliveryAddress}</p>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: 8 }}>Produs</th>
                  <th style={{ textAlign: "right", padding: 8 }}>Cantitate</th>
                </tr>
              </thead>
              <tbody>
                {o.items.map(it => (
                  <tr key={it.ItemId} style={{ borderTop: "1px solid #eee" }}>
                    <td style={{ padding: 8 }}>{productMap[it.ProductId] || it.ProductId}</td>
                    <td style={{ padding: 8, textAlign: "right" }}>{it.Quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <button onClick={() => removeOrder(o.OrderId)}>
                Șterge comanda
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
