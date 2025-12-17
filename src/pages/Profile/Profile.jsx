import React, { useState } from "react";
import {
  Edit3,
  Package,
  Users,
  MapPin,
  LogOut,
} from "lucide-react";
import { useUserAuth } from "../../context/UserAuthContext";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import OrderList from "./OrderList";
import "./Profile.css";
import Address from "./Address";

// ==========================
//  MODAL XÁC NHẬN ĐĂNG XUẤT
// ==========================
function ConfirmLogoutModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Đăng xuất</h3>
        <p className="modal-message">Bạn có chắc muốn đăng xuất không?</p>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onCancel}>
            Hủy
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================
//   TAB: THÔNG TIN TÀI KHOẢN
// ==========================
function ThongTinTaiKhoan({ user }) {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    hoTen: user?.fullName || "",
    gioiTinh: user?.gender || "Chọn",
    soDienThoai: user?.phone || "",
    email: user?.email || "",
    ngaySinh: user?.birthDate || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Lưu thông tin:", formData);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="content-section">
        <h1 className="section-title">THÔNG TIN TÀI KHOẢN</h1>

        <div className="info-display">
          <div className="info-row">
            <span className="info-label">Họ và tên</span>
            <span className="info-value">{formData.hoTen}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Giới tính</span>
            <span className="info-value">{formData.gioiTinh}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Số điện thoại</span>
            <span className="info-value">{formData.soDienThoai}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Email</span>
            <span className="info-value">{formData.email}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Ngày sinh</span>
            <span className="info-value">{formData.ngaySinh || "-"}</span>
          </div>
        </div>

        <button className="btn-edit" onClick={() => setIsEditing(true)}>
          <Edit3 size={18} />
          Sửa thông tin
        </button>
      </div>
    );
  }

  // FORM CHỈNH SỬA
  return (
    <div className="edit-overlay">
      <div className="edit-form-container">
        <h1 className="section-title">CHỈNH SỬA THÔNG TIN</h1>

        <div className="form-row">
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              name="hoTen"
              value={formData.hoTen}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Giới tính</label>
            <select
              name="gioiTinh"
              value={formData.gioiTinh}
              onChange={handleInputChange}
            >
              <option value="Chọn">Chọn</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Sinh nhật</label>
          <input
            type="date"
            name="ngaySinh"
            value={formData.ngaySinh}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-actions">
          <button className="btn-reset" onClick={() => setIsEditing(false)}>
            HỦY
          </button>
          <button className="btn-submit" onClick={handleSave}>
            LƯU
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================
//        SIDEBAR
// ==========================
function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const navigate = useNavigate();

  const menuItems = [
    { id: "thong-tin", title: "Thông tin tài khoản", icon: Edit3, path: "/profile" },
    { id: "so-dia-chi", title: "Số địa chỉ", icon: MapPin, path: "/profile/addresses" },
    { id: "don-hang", title: "Đơn hàng", icon: Package, path: "/profile/orders" },
    { id: "the-thanh-vien", title: "Thẻ thành viên", icon: Users, path: "/profile/membership" },
  ];

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Tài khoản</h3>

      {menuItems.map((item) => (
        <div
          key={item.id}
          className={`menu-item ${activeTab === item.id ? "active" : ""}`}
          onClick={() => {
            setActiveTab(item.id);
            navigate(item.path);
          }}
        >
          <item.icon size={18} />
          <span>{item.title}</span>
        </div>
      ))}

      <div className="menu-item logout" onClick={onLogout}>
        <LogOut size={18} />
        <span>Đăng xuất</span>
      </div>
    </div>
  );
}

// ==========================
//        TRANG PROFILE
// ==========================
export default function Profile() {
  const { user, logout } = useUserAuth();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ✅ Xác định tab hiện tại dựa trên URL
  const getActiveTab = () => {
    if (location.pathname.includes("/orders")) return "don-hang";
    if (location.pathname.includes("/addresses")) return "so-dia-chi";
    if (location.pathname.includes("/membership")) return "the-thanh-vien";
    return "thong-tin";
  };

  const activeTab = getActiveTab();

  // ✅ Render content dựa trên URL
  const renderContent = () => {
    // Nếu là nested route (/profile/orders/:id), render Outlet cho OrderDetail
    if (location.pathname.includes("/orders/")) {
      return <Outlet />;
    }

    // Nếu là /profile/orders (không có ID), render OrderList
    if (location.pathname === "/profile/orders") {
      return <OrderList />;
    }

    if (location.pathname === "/profile/addresses") {
      return <Address />;
    }

    if (location.pathname === "/profile/membership") {
      return <div>Đang Cập Nhật...</div>;
    }

    // Default: thông tin tài khoản
    return <ThongTinTaiKhoan user={user} />;
  };

  return (
    <>
      <div className="app-container">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={() => {}}
          onLogout={() => setShowLogoutModal(true)}
        />

        <div className="main-content">
          {renderContent()}
        </div>
      </div>

      <ConfirmLogoutModal
        isOpen={showLogoutModal}
        onConfirm={logout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}