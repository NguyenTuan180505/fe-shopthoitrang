// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/Product/ProductList';
import ProductForm from './pages/admin/Product/ProductForm';
import CategoryList from './pages/admin/Category/CategoryList';
import CategoryForm from './pages/admin/Category/CategoryForm';
import Login from './pages/admin/Login';

function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) return <div>Đang tải...</div>;

  if (!user) return <Navigate to="/admin/login" />;

  // ❗ CHẶN CUSTOMER, CHỈ CHO ADMIN
  if (user.role !== "ADMIN") {
    return <div style={{ padding: 20, fontSize: 20, color: "red" }}>
      ❌ Bạn không có quyền truy cập trang ADMIN
    </div>;
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: '250px' }}>
        <Header />
        <div className="p-4">
          <Routes>
            <Route path="" element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/add" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/add" element={<CategoryForm />} />
            <Route path="categories/edit/:id" element={<CategoryForm />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
