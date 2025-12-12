import { Link, NavLink } from "react-router-dom";
import styles from "./Header.module.css";
import ShoppingBag from "../../assets/icons/shopping-bag.svg";
import { useUserAuth } from "../../context/UserAuthContext";

export default function Header() {
  const { user, isAuthenticated, logout } = useUserAuth();

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.logo}>FASHION</div>

          {/* NAVIGATION */}
          <nav className={styles.nav}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
              }
            >
              HOME
            </NavLink>

            <NavLink
              to="/shop"
              className={({ isActive }) =>
                isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
              }
            >
              SHOP
            </NavLink>

            <NavLink
              to="/features"
              className={({ isActive }) =>
                isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
              }
            >
              FEATURES
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
              }
            >
              CONTACT
            </NavLink>
          </nav>

          {/* RIGHT SIDE */}
          <div className={styles.right}>
            {/* Cart icon */}
            <div className={styles.cartIconWrapper}>
              <img
                src={ShoppingBag}
                alt="cart_icon"
                className={styles.cartIcon}
              />
            </div>

            {/* LOGIN / LOGOUT */}
            {!isAuthenticated ? (
              // Chưa login → nút LOGIN
              <Link to="/login">
                <button className={styles.loginBtn}>LOGIN</button>
              </Link>
            ) : (
              // Đã login → Hiện email + nút Logout
              <div className={styles.userBox}>
                <Link to="/profile" className={styles.userEmail}>
                  {user?.email}
                </Link>

                <button className={styles.loginBtn} onClick={logout}>
                  LOGOUT
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
