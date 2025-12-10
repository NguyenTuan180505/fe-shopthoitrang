import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import ShoppingBag from "../../assets/icons/shopping-bag.svg";
import { NavLink } from "react-router-dom";
export default function Header() {
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.logo}>FASHION</div>

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

          <div className={styles.right}>
            <div className={styles.cartIconWrapper}>
              <img
                src={ShoppingBag}
                alt="cart_icon"
                className={styles.cartIcon}
              />
            </div>
            <button className={styles.loginBtn}>LOGIN</button>
          </div>
        </div>
      </div>
    </header>
  );
}
