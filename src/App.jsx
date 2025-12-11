// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// import Dashboard from './pages/admin/Dashboard';
// import Users from './pages/admin/Users';
import Products from './pages/admin/Products';
// import Categories from './pages/admin/Categories';
// import Orders from './pages/admin/Orders';
import Login from './pages/admin/Login';

function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) return <div>Đang tải...</div>;
  if (!user) return <Navigate to="/admin/login" />;

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: '250px' }}>
        <Header />
        <div className="p-4">
          <Routes>
            {/* <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} /> */}
            <Route path="/products" element={<Products />} />
            {/* <Route path="/categories" element={<Categories />} />
            <Route path="/orders" element={<Orders />} /> */}
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