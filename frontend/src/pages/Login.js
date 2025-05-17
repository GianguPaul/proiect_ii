// frontend/src/pages/Login.js
import { useState } from "react";
import { login } from "../services/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await login({ email, password: pw });
      localStorage.setItem("token", data.token);
      onLogin(data.user);
    } catch (err) {
      const msg =
        err.response?.data?.msg ||
        err.response?.data?.error ||
        "Eroare necunoscută";
      setError(msg);
    }
  };

  return (
    <form onSubmit={submit} className="form-card">
      {error && <p className="error-msg">{error}</p>}
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
