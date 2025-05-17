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
    role: "client"
  });

  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await register(form);
      setMsg("Înregistrare reușită! Te poți loga acum.");
      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        role: "client"
      });
    } catch (err) {
      setMsg("Eroare la înregistrare");
    }
  };

  return (
    <form onSubmit={submit} className="form-card">
      {msg && <p className={msg.includes("reușită") ? "info-msg" : "error-msg"}>{msg}</p>}

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
      <select
        value={form.role}
        onChange={e => setForm({ ...form, role: e.target.value })}
      >
        <option value="client">Client</option>
        <option value="courier">Curier</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
}
