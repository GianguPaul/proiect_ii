// frontend/src/services/api.js

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Interceptor pentru JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// — Autentificare & Înregistrare —
export const register = (data) => api.post("/auth/register", data);
export const login    = (credentials) => api.post("/auth/login", credentials);

// — Users (admin only) —
export const getUsers     = () => api.get("/users");
export const getUserById  = (id) => api.get(`/users/${id}`);
export const updateUser   = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser   = (id) => api.delete(`/users/${id}`);

// — Produse —
export const getProducts     = () => api.get("/products");
export const getProductById  = (id) => api.get(`/products/${id}`);
export const createProduct   = (data) => api.post("/products", data);
export const updateProduct   = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct   = (id) => api.delete(`/products/${id}`);

// — Comenzi —
// Pentru client: comenzi proprii
export const getOrdersByUser = (userId) => api.get(`/orders/user/${userId}`);
// Pentru admin/curier: toate comenzile
export const getAllOrders    = () => api.get("/orders");
// Creează o comandă
export const createOrder     = (order) => api.post("/orders", order);
// Actualizează status (admin/curier)
export const updateOrderStatus = (id, status) =>
  api.put(`/orders/${id}/status`, { status });
// Șterge o comandă
export const deleteOrder     = (id) => api.delete(`/orders/${id}`);

// Export default pentru cazuri particulare
export default api;
