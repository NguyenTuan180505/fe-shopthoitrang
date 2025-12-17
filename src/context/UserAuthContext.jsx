// src/context/UserAuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axiosClientUser from "../api/axiosClientUser";

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ============================
  // LẤY USER HIỆN TẠI
  // ============================
  const fetchCurrentUser = async () => {
    try {
      const res = await axiosClientUser.get("/users/me");
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Lỗi lấy user:", err);
      // ❌ KHÔNG logout ở đây
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // ============================
  // LOGIN → CHỈ GỬI OTP
  // ============================
  const login = async (email, password) => {
    try {
      await axiosClientUser.post("/auth/login", { email, password });
      return true;
    } catch (err) {
      console.error("Lỗi login:", err);
      return false;
    }
  };

  // ============================
  // VERIFY OTP → NHẬN TOKEN
  // ============================
  const verifyOtp = async (email, otp) => {
    try {
      const res = await axiosClientUser.post("/auth/verify-otp", {
        email,
        otp,
      });

      const token = res.data.token;
      localStorage.setItem("user_token", token);

      // ✅ SET AUTH TRƯỚC
      setIsAuthenticated(true);

      // ✅ SAU ĐÓ FETCH USER
      await fetchCurrentUser();

      return true;
    } catch (err) {
      console.error("Lỗi verify OTP:", err);
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
    localStorage.removeItem("otp_email");
    setUser(null);
    setIsAuthenticated(false);
  };

  // ============================
  // KIỂM TRA TOKEN KHI LOAD APP
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
        verifyOtp,
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
