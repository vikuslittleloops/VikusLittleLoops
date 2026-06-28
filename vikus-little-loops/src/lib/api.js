import axios from "axios";

// Central axios instance — points at the FastAPI backend.
// Set VITE_API_URL in a .env file when the backend is ready.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT (admin/customer) when present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("vll_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Example endpoints (wire to React Query in pages) ---
// export const getProducts = (params) => api.get("/products", { params }).then(r => r.data);
// export const getProduct  = (slug)   => api.get(`/products/${slug}`).then(r => r.data);
// export const getCategories = ()     => api.get("/categories").then(r => r.data);
