import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { logout } = useAuth();
  const location = useLocation();

  const getNavLinkClass = ({ isActive }) => {
    return `nav-link d-flex align-items-center mb-2 text-white ${
      isActive ? 'active-shadow' : 'opacity-75'
    }`;
  };

  const linkStyle = ({ isActive }) => ({
    backgroundColor: isActive ? '#4e73df' : 'transparent', 
    fontWeight: isActive ? '600' : '400',
    borderRadius: '10px', 
    padding: '12px 15px',
    transition: 'all 0.3s ease',
  });

  return (
    <div 
        className="d-flex flex-column flex-shrink-0 p-3 text-white" 
        style={{ 
            width: '260px', 
            height: '100vh', 
            position: 'fixed', 
            left: 0, 
            top: 0, 
            zIndex: 1000,
            backgroundColor: '#1c1c2e'
        }}
    >
      <a href="/admin" className="d-flex align-items-center mb-4 mt-2 px-2 text-white text-decoration-none">
        <div className="bg-primary rounded-3 d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
            <i className="bi bi-shop fs-4"></i>
        </div>
        <div>
            <div className="fw-bold fs-5 tracking-wide">SHOP ADMIN</div>
            <small className="text-secondary" style={{fontSize: '0.75rem'}}>Management System</small>
        </div>
      </a>
      
      <div className="overflow-auto custom-scrollbar" style={{ flex: 1 }}>
        
        <div className="px-2 mb-2">
            <small className="text-uppercase text-secondary fw-bold" style={{fontSize: '0.7rem', letterSpacing: '1px'}}>Tổng quan</small>
        </div>
        <ul className="nav nav-pills flex-column mb-4">
          <li className="nav-item">
            <NavLink to="/admin" end className={getNavLinkClass} style={linkStyle}>
              <i className="bi bi-grid-fill me-3 fs-5"></i>
              Dashboard
            </NavLink>
          </li>
        </ul>

        <div className="px-2 mb-2">
            <small className="text-uppercase text-secondary fw-bold" style={{fontSize: '0.7rem', letterSpacing: '1px'}}>Quản lý kho</small>
        </div>
        <ul className="nav nav-pills flex-column mb-4">
          <li className="nav-item">
            <NavLink to="/admin/products" className={getNavLinkClass} style={linkStyle}>
              <i className="bi bi-box-seam-fill me-3 fs-5"></i>
              Sản phẩm
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/categories" className={getNavLinkClass} style={linkStyle}>
              <i className="bi bi-tags-fill me-3 fs-5"></i>
              Danh mục
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/orders" className={getNavLinkClass} style={linkStyle}>
              <div className="d-flex justify-content-between w-100 align-items-center">
                  <span><i className="bi bi-receipt me-3 fs-5"></i>Đơn hàng</span>
              </div>
            </NavLink>
          </li>
        </ul>

        <div className="px-2 mb-2">
            <small className="text-uppercase text-secondary fw-bold" style={{fontSize: '0.7rem', letterSpacing: '1px'}}>Người dùng</small>
        </div>
        <ul className="nav nav-pills flex-column mb-4">
          <li className="nav-item">
            <NavLink to="/admin/users" className={getNavLinkClass} style={linkStyle}>
              <i className="bi bi-people-fill me-3 fs-5"></i>
              Khách hàng
            </NavLink>
          </li>
        </ul>

      </div>

      <div className="border-top border-secondary pt-3 mt-auto">
        <button 
            onClick={logout} 
            className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center border-0 text-start ps-3"
            style={{backgroundColor: 'rgba(255,255,255,0.05)'}}
        >
            <i className="bi bi-box-arrow-right me-3"></i>
            Đăng xuất
        </button>
      </div>

      <style>{`
        .active-shadow {
            box-shadow: 0 4px 20px 0 rgba(0,0,0,0.14), 0 7px 10px -5px rgba(78, 115, 223, 0.4);
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #888; 
            border-radius: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #555; 
        }
      `}</style>
    </div>
  );
}