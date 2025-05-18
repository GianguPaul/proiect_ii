// frontend/src/App.js
import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import CourierOrders from "./pages/CourierOrders";
import AdminProducts from "./pages/AdminProducts";
import "./LoginRegister.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [tab, setTab] = useState("login");
  const [view, setView] = useState("menu"); // 'menu' | 'cart' | 'orders'

  // Load user & cart from localStorage
  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (rawUser && rawUser !== "undefined") {
      try { setUser(JSON.parse(rawUser)); }
      catch { localStorage.removeItem("user"); }
    }
    const rawCart = localStorage.getItem("cart");
    if (rawCart && rawCart !== "undefined") {
      try { setCart(JSON.parse(rawCart)); }
      catch { localStorage.removeItem("cart"); }
    }
  }, []);

  // Authentication handlers
  const handleLogin = u => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };
  const handleLogout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
  };

  // Cart handlers
  const handleAddToCart = item => {
    setCart(prev => {
      const exists = prev.find(i => i.productId === item.productId);
      const next = exists
        ? prev.map(i => i.productId === item.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i)
        : [...prev, { ...item }];
      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    });
  };
  const handleQuantityChange = (productId, quantity) => {
    setCart(prev => {
      const next = prev
        .map(i => i.productId === productId ? { ...i, quantity } : i)
        .filter(i => i.quantity > 0);
      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    });
  };
  const handleSetCart = newCart => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Not authenticated
  if (!user) {
    return (
      <div className="single-card-wrapper">
        <div className="logo-box">
          <h1 style={{ fontSize: 32, margin: 0, color: "#333", fontWeight: 700, textShadow: "0 1px 1px rgba(0,0,0,0.1)" }}>
            Orderly
          </h1>
        </div>
        <div className="form-tab-card">
          <div className="tabs">
            <button className={tab === "login" ? "active" : ""} onClick={() => setTab("login")}>Login</button>
            <button className={tab === "register" ? "active" : ""} onClick={() => setTab("register")}>Register</button>
          </div>
          {tab === "login" ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Register />
          )}
        </div>
      </div>
    );
  }

  // Courier role
  if (user.role === "courier") {
    return <CourierOrders onLogout={handleLogout} />;
  }

  // Admin role
  if (user.role === "admin") {
    return <AdminProducts onLogout={handleLogout} />;
  }

  // Client dashboard
  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Header */}
      <header style={{ width: "100%", maxWidth: 900, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ textAlign: "center", flex: 1 }}>Bine ai venit, {user.name}</h1>
        <button onClick={handleLogout} style={{ padding: "8px 16px", borderRadius: 4, backgroundColor: "#e63946", color: "#fff", border: "none", cursor: "pointer" }}>
          Logout
        </button>
      </header>

      {/* Navbar */}
      <nav style={{ width: "100%", maxWidth: 900, display: "flex", justifyContent: "center", gap: 10, marginBottom: 20 }}>
        {[
          { key: "menu",   label: "Meniu" },
          { key: "cart",   label: "Coș" },
          { key: "orders", label: "Comenzi" }
        ].map(btn => (
          <button key={btn.key} onClick={() => setView(btn.key)} style={{ padding: "8px 16px", borderRadius: 4, backgroundColor: view === btn.key ? "#007bff" : "#ccc", color: "#fff", border: "none", cursor: "pointer" }}>
            {btn.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div style={{ width: "100%", maxWidth: 900 }}>
        {view === "menu" && (
          <section>
            <h2 style={{ textAlign: "center" }}>Meniu</h2>
            <Menu onAddToCart={handleAddToCart} />
          </section>
        )}

        {view === "cart" && (
          <section>
            <h2 style={{ textAlign: "center" }}>Coș</h2>
            {cart.length === 0 ? (
              <p style={{ textAlign: "center" }}>Coșul este gol.</p>
            ) : (
              <>
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: 8 }}>Produs</th>
                      <th style={{ textAlign: "center", padding: 8 }}>Cantitate</th>
                      <th style={{ textAlign: "right", padding: 8 }}>Acțiune</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.productId} style={{ borderTop: "1px solid #ddd" }}>
                        <td style={{ padding: 8 }}>{item.name}</td>
                        <td style={{ padding: 8, textAlign: "center" }}>
                          <input type="number" min={0} value={item.quantity} onChange={e => handleQuantityChange(item.productId, parseInt(e.target.value, 10) || 0)} style={{ width: 60, textAlign: "center" }} />
                        </td>
                        <td style={{ padding: 8, textAlign: "right" }}>
                          <button onClick={() => handleQuantityChange(item.productId, 0)}>Șterge</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ textAlign: "center", marginTop: 10 }}>
                  <strong>Total: {cart.reduce((sum, i) => sum + i.quantity * i.pricePerUnit, 0)} lei</strong>
                </div>
              </>
            )}
          </section>
        )}

        {view === "orders" && (
          <section>
            <h2 style={{ textAlign: "center" }}>Comenzi existente</h2>
            <Orders cart={cart} setCart={handleSetCart} user={user} />
          </section>
        )}
      </div>
    </div>
  );
}