// frontend/src/pages/Register.js

import { useState } from "react";
import { register } from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "client"   // default role; change or remove if you don't want to expose this
  });
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      setMsg("Înregistrare reușită! Te poți loga acum.");
    } catch (err) {
      setMsg("Eroare la înregistrare");
      console.error("REGISTER ERROR:", err.response?.data || err);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: "8px", maxWidth: 300 }}>
      {msg && <p>{msg}</p>}

      <input
        placeholder="Nume"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        required
      />

      <input
        type="password"
        placeholder="Parolă"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        required
      />

      <input
        type="tel"
        placeholder="Telefon"
        value={form.phone}
        onChange={e => setForm({ ...form, phone: e.target.value })}
      />

      <input
        type="text"
        placeholder="Adresă"
        value={form.address}
        onChange={e => setForm({ ...form, address: e.target.value })}
      />

      {/* Dacă vrei să alegi rolul direct în UI, decomentează următorul bloc:
      <select
        value={form.role}
        onChange={e => setForm({ ...form, role: e.target.value })}
      >
        <option value="client">Client</option>
        <option value="courier">Curier</option>
        <option value="admin">Admin</option>
      </select>
      */}

      <button type="submit">Register</button>
    </form>
  );
}
