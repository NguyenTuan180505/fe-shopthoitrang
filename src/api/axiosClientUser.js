// src/api/axiosClientUser.js
import axios from "axios";

const axiosClientUser = axios.create({
  baseURL: "http://huytran1611-001-site1.anytempurl.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Gắn token user đúng tên
axiosClientUser.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("user_token");
    console.log("User Token:", token); // Debug: Kiểm tra token lấy được
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ CHỈ xóa token, KHÔNG redirect cứng
axiosClientUser.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Chỉ xóa token, để context tự xử lý
      localStorage.removeItem("user_token");
      localStorage.removeItem("otp_email");
      // Có thể dispatch event nếu cần
      // window.dispatchEvent(new Event("unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default axiosClientUser;