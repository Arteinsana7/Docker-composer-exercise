import axios from "axios";

// URL of the API from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Create an Axios instance with base URL
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// add token to each request if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
