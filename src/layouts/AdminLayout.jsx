import { Routes, Route, Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import Dashboard from "../pages/admin/Dashboard";
import ProductList from "../pages/admin/Product/ProductList";
import ProductForm from "../pages/admin/Product/ProductForm";
import CategoryList from "../pages/admin/Category/CategoryList";
import CategoryForm from "../pages/admin/Category/CategoryForm";
import Users from "../pages/admin/User/User";
import Orders from "../pages/admin/Order/Order";
import OrderDetailModal from "../pages/admin/Order/OrderDetailModal";

export default function AdminLayout() {
  const { user, loading, isAuthenticated } = useUserAuth();

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Sửa điều kiện role – dùng optional chaining và logic đúng
  const isAdmin = user.role && (
    user.role.roleName === "ADMIN" || user.roleID === 1
  );

  if (!isAdmin) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "red", marginLeft: "260px" }}>
        <h2>🚫 Truy cập bị từ chối</h2>
        <p>Bạn không có quyền truy cập khu vực quản trị.</p>
        <button onClick={() => window.location.href = "/"} className="btn btn-primary">
          Quay về trang chủ
        </button>
      </div>
    );
  }

  // 4. Đủ điều kiện → render admin layout
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <Header />
        <div className="p-4">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/add" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/add" element={<CategoryForm />} />
            <Route path="categories/edit/:id" element={<CategoryForm />} />
            <Route path="users" element={<Users />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orderdetail" element={<OrderDetailModal />} />
            {/* Optional: catch all */}
            <Route path="*" element={<Navigate to="" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
