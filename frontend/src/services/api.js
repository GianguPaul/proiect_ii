// frontend/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" }
});

// Adaugă automat token-ul JWT dacă există
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** — Autentificare & Înregistrare — **/
export const register    = data        => api.post("/auth/register", data);
export const login       = credentials => api.post("/auth/login", credentials);

/** — Users (admin) — **/
export const getUsers     = ()      => api.get("/users");
export const getUserById  = id      => api.get(`/users/${id}`);
export const createUser   = data    => api.post("/users", data);
export const updateUser   = (id, d) => api.put(`/users/${id}`, d);
export const deleteUser   = id      => api.delete(`/users/${id}`);

/** — Produse — **/
export const getProducts    = ()      => api.get("/products");
export const getProductById = id      => api.get(`/products/${id}`);
export const createProduct  = data    => api.post("/products", data);
export const updateProduct  = (id, d) => api.put(`/products/${id}`, d);
export const deleteProduct  = id      => api.delete(`/products/${id}`);

/** — Comenzi — **/
// client: propriile comenzi
export const getOrdersByUser   = userId => api.get(`/orders/user/${userId}`);
// admin/curier: toate comenzile
export const getAllOrders      = ()      => api.get("/orders");
// creare comandă
export const createOrder       = order   => api.post("/orders", order);
// actualizare status (PUT)
export const updateOrderStatus = (id, st) => api.put(`/orders/${id}/status`, { status: st });
// ștergere comandă
export const deleteOrder       = id      => api.delete(`/orders/${id}`);

// fallback export
export default api;
