// frontend/src/pages/AdminProducts.js

import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../services/api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm]       = useState({
    Name: "", Description: "", Category: "", Price: 0, ImageUrl: "", IsAvailable: true
  });

  // Fetch all products
  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error("Eroare la getProducts:", err);
    }
  };

  // Create
  const handleCreate = async e => {
    e.preventDefault();
    try {
      await createProduct(form);
      setForm({ Name:"", Description:"", Category:"", Price:0, ImageUrl:"", IsAvailable:true });
      load();
    } catch (err) {
      console.error("Eroare la createProduct:", err);
    }
  };

  // Update
  const handleUpdate = async (id, updated) => {
    try {
      await updateProduct(id, updated);
      load();
    } catch (err) {
      console.error("Eroare la updateProduct:", err);
    }
  };

  // Delete
  const handleDelete = async id => {
    if (!window.confirm("Sigur ștergi produsul?")) return;
    try {
      await deleteProduct(id);
      load();
    } catch (err) {
      console.error("Eroare la deleteProduct:", err);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800 }}>
      <h2>Admin Products</h2>

      <form onSubmit={handleCreate} style={{ display:"grid", gap:8, marginBottom:20 }}>
        <h3>Creare Produs</h3>
        <input
          placeholder="Name"
          value={form.Name}
          onChange={e => setForm({...form, Name: e.target.value})}
          required
        />
        <textarea
          placeholder="Description"
          value={form.Description}
          onChange={e => setForm({...form, Description: e.target.value})}
          rows={3}
          required
        />
        <input
          placeholder="Category"
          value={form.Category}
          onChange={e => setForm({...form, Category: e.target.value})}
        />
        <input
          type="number"
          placeholder="Price"
          value={form.Price}
          onChange={e => setForm({...form, Price: parseFloat(e.target.value)})}
          required
        />
        <input
          placeholder="ImageUrl"
          value={form.ImageUrl}
          onChange={e => setForm({...form, ImageUrl: e.target.value})}
        />
        <label>
          <input
            type="checkbox"
            checked={form.IsAvailable}
            onChange={e => setForm({...form, IsAvailable: e.target.checked})}
          />
          Disponibil
        </label>
        <button type="submit">Crează Produs</button>
      </form>

      <h3>Lista Produse</h3>
      <table border="1" cellPadding={8} style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead>
          <tr>
            <th>Id</th><th>Name</th><th>Description</th><th>Price</th><th>Available</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.ProductId}>
              <td>{p.ProductId}</td>
              <td>
                <input
                  type="text"
                  value={p.Name}
                  onChange={e => handleUpdate(p.ProductId, { Name: e.target.value })}
                />
              </td>
              <td>
                <textarea
                  rows={2}
                  value={p.Description}
                  onChange={e => handleUpdate(p.ProductId, { Description: e.target.value })}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={p.Price}
                  onChange={e => handleUpdate(p.ProductId, { Price: parseFloat(e.target.value) })}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={p.IsAvailable}
                  onChange={e => handleUpdate(p.ProductId, { IsAvailable: e.target.checked })}
                />
              </td>
              <td>
                <button onClick={() => handleDelete(p.ProductId)}>Șterge</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
