import axios from "axios";

// URL of the API from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Create an Axios instance with base URL
export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // avoids the request to be pending forever, 10 secs instead
  headers: {
    "Content-Type": "application/json",
  },
});

// === REQUEST INTERCEPTOR ===
// Add token to each request if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// === RESPONSE INTERCEPTOR ===
// Handle errors globally
api.interceptors.response.use(
  (response) => {
    // Success - return response as is
    return response;
  },
  (error) => {
    // 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      console.warn("⚠️ Unauthorized - Redirecting to login");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // 403 Forbidden - No permission
    if (error.response?.status === 403) {
      console.error("🚫 Access forbidden");
    }

    // 404 Not Found
    if (error.response?.status === 404) {
      console.error("❌ Resource not found");
    }

    // 500 Server Error
    if (error.response?.status === 500) {
      console.error("💥 Server error:", error.response.data);
    }

    // Network error (no response)
    if (!error.response) {
      console.error("🌐 Network error - Check your connection");
    }

    return Promise.reject(error);
  }
);

export default api;
