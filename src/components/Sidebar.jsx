// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { logout } = useAuth();

  const menuItems = [
    { to: "/admin", icon: "🏠", text: "Dashboard" },
    { to: "/admin/users", icon: "👥", text: "Người dùng" },
    { to: "/admin/products", icon: "👚", text: "Sản phẩm" },
    { to: "/admin/categories", icon: "📂", text: "Danh mục" },
    { to: "/admin/orders", icon: "📦", text: "Đơn hàng" },
  ];

  return (
    <div className="bg-dark text-white vh-100 p-3" style={{ width: '250px', position: 'fixed' }}>
      <h4 className="text-center mb-4">ADMIN SHOP</h4>
      <hr />
      <ul className="nav flex-column">
        {menuItems.map(item => (
          <li className="nav-item mb-2" key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) => 
                `nav-link text-white ${isActive ? 'bg-primary' : ''}`
              }
              style={{ borderRadius: '8px' }}
            >
              <span className="me-2">{item.icon}</span> {item.text}
            </NavLink>
          </li>
        ))}
      </ul>
      <hr />
      <button onClick={logout} className="btn btn-outline-light w-100">
        Đăng xuất
      </button>
    </div>
  );
}