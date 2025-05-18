// frontend/src/pages/AdminProducts.js
import React, { useState, useEffect } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../services/api";

export default function AdminProducts({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [newProd, setNewProd] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
    isAvailable: true
  });
  const [editId, setEditId] = useState(null);
  const [editProd, setEditProd] = useState({});

  // Fetch products list
  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error("Eroare la încărcarea produselor:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handlers for new product form
  const handleChangeNew = e => {
    const { name, value, type, checked } = e.target;
    setNewProd(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  const handleCreate = async e => {
    e.preventDefault();
    try {
      await createProduct({
        Name: newProd.name,
        Description: newProd.description,
        Price: parseFloat(newProd.price),
        ImageUrl: newProd.imageUrl,
        Category: newProd.category,
        IsAvailable: newProd.isAvailable
      });
      setNewProd({ name: "", description: "", price: "", imageUrl: "", category: "", isAvailable: true });
      fetchProducts();
    } catch (err) {
      console.error("Eroare la creare produs:", err);
    }
  };

  // Handlers for edit form
  const startEdit = p => {
    setEditId(p.ProductId);
    setEditProd({
      name: p.Name,
      description: p.Description,
      price: p.Price,
      imageUrl: p.ImageUrl || "",
      category: p.Category || "",
      isAvailable: p.IsAvailable
    });
  };
  const handleChangeEdit = e => {
    const { name, value, type, checked } = e.target;
    setEditProd(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  const handleSave = async id => {
    try {
      await updateProduct(id, {
        Name: editProd.name,
        Description: editProd.description,
        Price: parseFloat(editProd.price),
        ImageUrl: editProd.imageUrl,
        Category: editProd.category,
        IsAvailable: editProd.isAvailable
      });
      setEditId(null);
      fetchProducts();
    } catch (err) {
      console.error("Eroare la actualizare produs:", err);
    }
  };

  // Handler delete
  const handleDelete = async id => {
    if (!window.confirm("Ștergi definitiv acest produs?")) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      console.error("Eroare la ștergere produs:", err);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      {/* Logout */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button
          onClick={onLogout}
          style={{ padding: "6px 12px", borderRadius: 4, backgroundColor: "#e63946", color: "#fff", border: "none", cursor: "pointer" }}
        >Logout</button>
      </div>

      {/* Titlu */}
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Administrare Produse</h2>

      {/* New product form */}
      <form onSubmit={handleCreate} style={{ marginBottom: 20, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr auto", gap: 8 }}>
        <input name="name" placeholder="Nume" value={newProd.name} onChange={handleChangeNew} required />
        <input name="description" placeholder="Descriere" value={newProd.description} onChange={handleChangeNew} required />
        <input name="price" type="number" step="0.01" placeholder="Preț" value={newProd.price} onChange={handleChangeNew} required style={{ width: 80 }} />
        <input name="imageUrl" placeholder="URL imagine" value={newProd.imageUrl} onChange={handleChangeNew} />
        <input name="category" placeholder="Categorie" value={newProd.category} onChange={handleChangeNew} required />
        <label style={{ display: "flex", alignItems: "center" }}>
          <input name="isAvailable" type="checkbox" checked={newProd.isAvailable} onChange={handleChangeNew} /> Disponibil
        </label>
        <button type="submit" style={{ padding: "6px 12px" }}>Adaugă produs</button>
      </form>

      {/* Products table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>Imagine</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>Nume</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>Descriere</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>Preț</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>Categorie</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>Disponibil</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.ProductId} style={{ borderTop: "1px solid #eee" }}>
              {editId === p.ProductId ? (
                <>
                  <td style={{ padding: 8 }}><input name="imageUrl" value={editProd.imageUrl} onChange={handleChangeEdit} /></td>
                  <td style={{ padding: 8 }}><input name="name" value={editProd.name} onChange={handleChangeEdit} /></td>
                  <td style={{ padding: 8 }}><input name="description" value={editProd.description} onChange={handleChangeEdit} /></td>
                  <td style={{ padding: 8 }}><input name="price" type="number" step="0.01" value={editProd.price} onChange={handleChangeEdit} style={{ width: 80 }} /></td>
                  <td style={{ padding: 8 }}><input name="category" value={editProd.category} onChange={handleChangeEdit} /></td>
                  <td style={{ padding: 8, textAlign: "center" }}><input name="isAvailable" type="checkbox" checked={editProd.isAvailable} onChange={handleChangeEdit} /></td>
                  <td style={{ padding: 8 }}>
                    <button onClick={() => handleSave(p.ProductId)} style={{ marginRight: 8 }}>Salvează</button>
                    <button onClick={() => setEditId(null)}>Renunță</button>
                  </td>
                </>
              ) : (
                <>
                  <td style={{ padding: 8 }}>
                    {p.ImageUrl ? <img src={p.ImageUrl} alt={p.Name} style={{ height: 40 }} /> : "-"}
                  </td>
                  <td style={{ padding: 8 }}>{p.Name}</td>
                  <td style={{ padding: 8 }}>{p.Description}</td>
                  <td style={{ padding: 8, textAlign: "right" }}>{p.Price} lei</td>
                  <td style={{ padding: 8 }}>{p.Category}</td>
                  <td style={{ padding: 8, textAlign: "center" }}>{p.IsAvailable ? "Da" : "Nu"}</td>
                  <td style={{ padding: 8 }}>
                    <button onClick={() => startEdit(p)} style={{ marginRight: 8 }}>Editează</button>
                    <button onClick={() => handleDelete(p.ProductId)}>Șterge</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}