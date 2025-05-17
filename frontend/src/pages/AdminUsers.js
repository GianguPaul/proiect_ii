// frontend/src/pages/AdminUsers.js

import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from "../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm]   = useState({
    name: "", email: "", password: "", phone: "", address: "", role: "client"
  });

  // Fetch all users
  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Eroare la getUsers:", err);
    }
  };

  // Create new user
  const handleCreate = async e => {
    e.preventDefault();
    try {
      await createUser(form);
      setForm({ name:"", email:"", password:"", phone:"", address:"", role:"client" });
      load();
    } catch (err) {
      console.error("Eroare la createUser:", err);
    }
  };

  // Update an existing user
  const handleUpdate = async (id, updated) => {
    try {
      await updateUser(id, updated);
      load();
    } catch (err) {
      console.error("Eroare la updateUser:", err);
    }
  };

  // Delete a user
  const handleDelete = async id => {
    if (!window.confirm("Sigur ștergi userul?")) return;
    try {
      await deleteUser(id);
      load();
    } catch (err) {
      console.error("Eroare la deleteUser:", err);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800 }}>
      <h2>Admin Users</h2>

      <form onSubmit={handleCreate} style={{ display: "grid", gap: 8, marginBottom: 20 }}>
        <h3>Creare User</h3>
        {["name","email","password","phone","address"].map(field => (
          <input
            key={field}
            type={field === "password" ? "password" : "text"}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={e => setForm({...form, [field]: e.target.value})}
            required={field !== "phone" && field !== "address"}
          />
        ))}
        <select
          value={form.role}
          onChange={e => setForm({...form, role: e.target.value})}
        >
          <option value="client">Client</option>
          <option value="courier">Curier</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Crează User</button>
      </form>

      <h3>Lista Users</h3>
      <table border="1" cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Id</th><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Address</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.UserId}>
              <td>{u.UserId}</td>
              <td>
                <input
                  type="text"
                  value={u.Name}
                  onChange={e => handleUpdate(u.UserId, { name: e.target.value })}
                />
              </td>
              <td>
                <input
                  type="email"
                  value={u.Email}
                  onChange={e => handleUpdate(u.UserId, { email: e.target.value })}
                />
              </td>
              <td>
                <select
                  value={u.Role}
                  onChange={e => handleUpdate(u.UserId, { role: e.target.value })}
                >
                  <option value="client">Client</option>
                  <option value="courier">Curier</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={u.Phone || ""}
                  onChange={e => handleUpdate(u.UserId, { phone: e.target.value })}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={u.Address || ""}
                  onChange={e => handleUpdate(u.UserId, { address: e.target.value })}
                />
              </td>
              <td>
                <button onClick={() => handleDelete(u.UserId)}>Șterge</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
