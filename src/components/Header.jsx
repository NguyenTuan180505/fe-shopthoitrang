// src/components/Header.jsx
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user } = useAuth();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container-fluid">
        <span className="navbar-brand">Quản trị viên</span>
        <div className="d-flex align-items-center text-white">
          <span className="me-3">Xin chào, {user?.fullName || 'Admin'}</span>
        </div>
      </div>
    </nav>
  );
}