// frontend/src/App.js
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import "./LoginRegister.css"; // fișierul CSS corect

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [tab, setTab] = useState("login");

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (rawUser && rawUser !== "undefined") {
      try {
        setUser(JSON.parse(rawUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    const rawCart = localStorage.getItem("cart");
    if (rawCart && rawCart !== "undefined") {
      try {
        setCart(JSON.parse(rawCart));
      } catch {
        localStorage.removeItem("cart");
      }
    }
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
  };

  const handleAddToCart = (product) => {
    const next = [...cart, product];
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  const handleSetCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Dacă nu este autentificat
  if (!user) {
    return (
      <div className="single-card-wrapper">
        <div className="logo-box">
          <h1 style={{
            fontSize: "32px",
            margin: 0,
            color: "#333",
            fontWeight: "700",
            textShadow: "0 1px 1px rgba(0,0,0,0.1)"
          }}>
            Orderly
          </h1>
        </div>

        <div className="form-tab-card">
          <div className="tabs">
            <button
              className={tab === "login" ? "active" : ""}
              onClick={() => setTab("login")}
            >
              Login
            </button>
            <button
              className={tab === "register" ? "active" : ""}
              onClick={() => setTab("register")}
            >
              Register
            </button>
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

  // Dacă utilizatorul este logat
  return (
    <div style={{ padding: 20 }}>
      <header style={{ marginBottom: 20 }}>
        <h1>Bine ai venit, {user.name}</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <section style={{ marginBottom: 40 }}>
        <h2>Meniu</h2>
        <Menu onAddToCart={handleAddToCart} />
      </section>

      <section>
        <h2>Coș &amp; Comenzi</h2>
        <Orders cart={cart} setCart={handleSetCart} user={user} />
      </section>
    </div>
  );
}

export default App;
