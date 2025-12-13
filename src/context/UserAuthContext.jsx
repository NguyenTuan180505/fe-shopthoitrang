// src/context/UserAuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axiosClientUser from "../api/axiosClientUser";

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ============================
  // LẤY USER TỪ BACKEND /users/me
  // ============================
  const fetchCurrentUser = async () => {
    try {
      const res = await axiosClientUser.get("/users/me");
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Lỗi lấy thông tin user:", err);
      logout();
    }
  };

  // ============================
  // ĐĂNG NHẬP
  // ============================
  const login = async (email, password) => {
    try {
      const res = await axiosClientUser.post("/auth/login", { email, password });

      const token = res.data.token;
      localStorage.setItem("user_token", token);

      // lấy user đầy đủ
      await fetchCurrentUser();

      return true;
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      return false;
    }
  };

  // ============================
  // ĐĂNG KÝ
  // ============================
  const signup = async (fullName, email, password, phone) => {
    try {
      await axiosClientUser.post("/auth/register", {
        fullName,
        email,
        password,
        phone,
      });

      return true;
    } catch {
      return false;
    }
  };

  // ============================
  // ĐĂNG XUẤT
  // ============================
  const logout = () => {
    localStorage.removeItem("user_token");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  // ============================
  // KIỂM TRA TOKEN KHI LOAD TRANG
  // ============================
  useEffect(() => {
  const init = async () => {
    const token = localStorage.getItem("user_token");

    if (token) {
      await fetchCurrentUser();  
    }

    setLoading(false);
  };

  init();
}, []);


  return (
    <UserAuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext);
