// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Decode JWT để lấy thông tin
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        email: payload.sub,
        userId: payload.userId,
        role: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      const decoded = decodeToken(token);

      if (!decoded) {
        localStorage.removeItem('admin_token');
      } else {
        setUser(decoded);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axiosClient.post('/auth/login', { email, password });
    const token = res.data.token;

    localStorage.setItem('admin_token', token);

    const decoded = decodeToken(token);
    setUser(decoded);

    return decoded;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
    window.location.href = '/admin/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
