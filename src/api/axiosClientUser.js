// src/api/axiosClientUser.js
import axios from "axios";

const axiosClientUser = axios.create({
  baseURL: "https://localhost:7298/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================
// GẮN TOKEN VÀO REQUEST
// ============================
axiosClientUser.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("user_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================
// KHÔNG REDIRECT Ở ĐÂY ❌
// ============================
axiosClientUser.interceptors.response.use(
  (response) => response,
  (error) => {
    // Chỉ reject, KHÔNG điều hướng
    return Promise.reject(error);
  }
);

export default axiosClientUser;
