import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
  };

  if (!user) {
    return (
      <div>
        <h1>Autentificare</h1>
        <Login onLogin={handleLogin} />
        <h2>Înregistrare</h2>
        <Register />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Bine ai venit, {user.name}</h1>
      <button onClick={handleLogout}>Logout</button>
      <h2>Meniu</h2>
      <Menu onAddToCart={(p) => setCart([...cart, p])} />
      <h2>Comenzi</h2>
      <Orders cart={cart} setCart={setCart} user={user} />
    </div>
  );
}

export default App;
