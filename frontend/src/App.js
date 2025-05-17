// frontend/src/App.js
import { useState, useEffect } from "react";
import Login    from "./pages/Login";
import Register from "./pages/Register";
import Menu     from "./pages/Menu";
import Orders   from "./pages/Orders";

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // --- Restore user ---
    const rawUser = localStorage.getItem("user");
    if (rawUser && rawUser !== "undefined") {
      try {
        setUser(JSON.parse(rawUser));
      } catch (e) {
        console.warn("Could not parse stored user:", rawUser);
        localStorage.removeItem("user");
      }
    }

    // --- Restore cart ---
    const rawCart = localStorage.getItem("cart");
    if (rawCart && rawCart !== "undefined") {
      try {
        setCart(JSON.parse(rawCart));
      } catch (e) {
        console.warn("Could not parse stored cart:", rawCart);
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
    setCart(prev => {
      const next = [...prev, product];
      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    });
  };

  const handleSetCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Autentificare</h1>
        <Login onLogin={handleLogin} />
        <h2>Înregistrare</h2>
        <Register />
      </div>
    );
  }

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
