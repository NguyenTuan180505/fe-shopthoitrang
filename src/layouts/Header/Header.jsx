import { useState, useRef, useEffect } from "react";
import styles from "./Header.module.css";
import ShoppingBag from "../../assets/icons/shopping-bag.svg";
import { useUserAuth } from "../../context/UserAuthContext";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Header() {
  const { user, isAuthenticated, logout } = useUserAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const handleCartClick = () => {
    if (!isAuthenticated) {
      setShowCartModal(true);
      return;
    }
    navigate("/cart");
  };

  const handleCartLoginClick = () => {
    setShowCartModal(false);
    navigate("/login");
  };

  const handleCartCancelClick = () => {
    setShowCartModal(false);
  };

  return (
    <header className={styles.header}>
      {/* Modal giỏ hàng */}
      {showCartModal && (
        <div className={styles.modalOverlay} onClick={handleCartCancelClick}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Yêu cầu đăng nhập</h2>
              <button 
                className={styles.modalClose} 
                onClick={handleCartCancelClick}
              >
                ✕
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <p>Vui lòng đăng nhập để xem giỏ hàng của bạn</p>
            </div>

            <div className={styles.modalFooter}>
              <button 
                className={styles.cancelBtn}
                onClick={handleCartCancelClick}
              >
                Hủy
              </button>
              <button 
                className={styles.loginBtn_modal}
                onClick={handleCartLoginClick}
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <div className={styles.inner}>
          <div className={styles.logo}>FASHION</div>

          {/* THANH ĐIỀU HƯỚNG */}
          <nav className={styles.nav}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
              }
            >
              TRANG CHỦ
            </NavLink>

            <NavLink
              to="/shop"
              className={({ isActive }) =>
                isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
              }
            >
              CỬA HÀNG
            </NavLink>

            <NavLink
              to="/features"
              className={({ isActive }) =>
                isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
              }
            >
              TÍNH NĂNG
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
              }
            >
              LIÊN HỆ
            </NavLink>
          </nav>

          {/* BÊN PHẢI */}
          <div className={styles.right}>
            {/* Biểu tượng giỏ hàng */}
            <div
              className={styles.cartIconWrapper}
              onClick={handleCartClick}
              style={{ cursor: "pointer" }}
            >
              <img
                src={ShoppingBag}
                alt="biểu_tượng_giỏ_hàng"
                className={styles.cartIcon}
              />
            </div>

            {/* ĐĂNG NHẬP / PROFILE DROPDOWN */}
            {!isAuthenticated ? (
              // Chưa đăng nhập → nút ĐĂNG NHẬP
              <Link to="/login">
                <button className={styles.loginBtn}>ĐĂNG NHẬP</button>
              </Link>
            ) : (
              // Đã đăng nhập → Profile Dropdown
              <div className={styles.profileWrapper} ref={dropdownRef}>
                <div
                  className={styles.profileTrigger}
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className={styles.profileIcon}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className={styles.profileInfo}>
                    <div className={styles.profileName}>Tài khoản</div>
                    <div className={styles.profileEmail}>{user?.fullName}</div>
                  </div>
                  <svg
                    className={`${styles.dropdownArrow} ${
                      showDropdown ? styles.dropdownArrowOpen : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className={styles.dropdownMenu}>
                    <button
                      type="button"
                      className={styles.dropdownItem}
                      onClick={() => {
                        setShowDropdown(false);
                        navigate("/profile");
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Thông tin cá nhân</span>
                    </button>

                    <div className={styles.dropdownDivider}></div>

                    <button
                      className={styles.dropdownItem}
                      onClick={handleLogout}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}