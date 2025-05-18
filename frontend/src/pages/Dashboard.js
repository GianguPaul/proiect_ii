import React, { useRef, useState } from "react";
import Menu from "./Menu";
import Orders from "./Orders";

export default function Dashboard({ user }) {
  const [cart, setCart] = useState([]);
  const menuRef = useRef(null);
  const cosRef  = useRef(null);
  const comenziRef = useRef(null);

  const scrollTo = ref => {
    if (ref.current) ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      {/* NAVBAR fix sus */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          background: "#fff",
          padding: "10px 20px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          zIndex: 1000
        }}
      >
        <button onClick={() => scrollTo(menuRef)}>Meniu</button>
        <button onClick={() => scrollTo(cosRef)}>Coș</button>
        <button onClick={() => scrollTo(comenziRef)}>Comenzi</button>
      </nav>

      {/* conținut cu padding ca să nu fie „tăiat” de navbar */}
      <div style={{ paddingTop: 70 }}>
        {/* Titlu centrat */}
        <h1 style={{ textAlign: "center", margin: "20px 0" }}>
          Bine ai venit, {user.name}
        </h1>

        {/* Secțiunea Meniu */}
        <section ref={menuRef} id="menu" style={{ padding: "40px 20px" }}>
          <h2>Meniu</h2>
          <Menu onAddToCart={item => setCart(prev => [...prev, item])} />
        </section>

        {/* Secțiunea Coș */}
        <section ref={cosRef} id="cos" style={{ padding: "40px 20px" }}>
          <h2>Coș</h2>
          {/* Poți extrage componenta Cart dacă ai una, altfel inline: */}
          {cart.length === 0
            ? <p>Coșul este gol.</p>
            : (
              <ul>
                {cart.map((it,i) => (
                  <li key={i}>{it.name} x{it.quantity}</li>
                ))}
              </ul>
            )
          }
        </section>

        {/* Secțiunea Comenzi */}
        <section ref={comenziRef} id="comenzi" style={{ padding: "40px 20px" }}>
          <h2>Comenzi existente</h2>
          <Orders cart={cart} setCart={setCart} user={user} />
        </section>
      </div>
    </div>
  );
}
