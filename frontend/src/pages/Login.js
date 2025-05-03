import { useState } from "react";
import api from "../services/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pw, setPw]     = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");              // curăţăm mesajul anterior
    try {
      const { data } = await api.post("/auth/login", { email, password: pw });
      localStorage.setItem("token", data.token);
      onLogin(data.user);
    } catch (err) {
      // încercăm să preluăm mesajul fie din `msg`, fie din `error`, altfel fallback generic
      const msg =
        err.response?.data?.msg ||
        err.response?.data?.error ||
        "Eroare necunoscută"  ;
      setError(msg);
      console.error("LOGIN ERROR DETAIL:", err.response?.data || err);
    }
  };

  return (
    <form onSubmit={submit}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Parolă"
        value={pw}
        onChange={e => setPw(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
