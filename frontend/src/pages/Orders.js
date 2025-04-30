import { useEffect, useState } from "react";
import api from "../services/api";

export default function Orders({ cart, setCart, user }) {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    api.get(`/orders/user/${user.id}`).then(res => setOrders(res.data));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const checkout = async () => {
    if (cart.length === 0) return;
    await api.post("/orders", { deliveryAddress: user.address, items: cart });
    setCart([]);
    fetchOrders();
  };

  const deleteOrder = async (id) => {
    await api.delete(`/orders/${id}`);
    fetchOrders();
  };

  return (
    <div>
      <h3>Coș</h3>
      {cart.map((it, i) => (
        <div key={i}>
          {it.Name} x{it.quantity}
        </div>
      ))}
      <button onClick={checkout}>Trimite comandă</button>

      <h3>Comenzi existente</h3>
      {orders.map(o => (
        <div
          key={o.OrderId}
          style={{ border: "1px solid #ddd", margin: "5px", padding: "5px" }}
        >
          <p>
            ID: {o.OrderId} | Status: {o.Status} | Total: {o.TotalPrice}
          </p>
          <p>Items:</p>
          <ul>
            {o.items.map(it => (
              <li key={it.ItemId}>
                {it.ProductId} x{it.Quantity}
              </li>
            ))}
          </ul>
          <button onClick={() => deleteOrder(o.OrderId)}>Șterge</button>
        </div>
      ))}
    </div>
  );
}
