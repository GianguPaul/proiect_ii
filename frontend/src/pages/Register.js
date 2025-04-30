import { useState } from "react";
import api from "../services/api";

export default function Register() {
  const [form, setForm] = useState({name:"",email:"",password:""});
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      setMsg("Înregistrare reușită! Te poți loga acum.");
    } catch (err) {
      setMsg("Eroare la înregistrare");
    }
  };

  return (
    <form onSubmit={submit}>
      {msg && <p>{msg}</p>}
      <input placeholder="Nume" onChange={e=>setForm({...form,name:e.target.value})} required/>
      <input type="email" placeholder="Email" onChange={e=>setForm({...form,email:e.target.value})} required/>
      <input type="password" placeholder="Parolă" onChange={e=>setForm({...form,password:e.target.value})} required/>
      <button type="submit">Register</button>
    </form>
  );
}
