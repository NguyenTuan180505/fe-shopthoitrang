import styles from "./Footer.module.css";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.col}>
            <h2>FASHION</h2>
            <p>Social Media</p>
            <div className={styles.icons}>
              <FaFacebook />
              <FaTwitter />
              <FaInstagram />
            </div>
          </div>

          <div className={styles.col}>
            <h3>SHOP</h3>
            <p>Products</p>
            <p>Overview</p>
            <p>Pricing</p>
            <p>Releases</p>
          </div>

          <div className={styles.col}>
            <h3>COMPANY</h3>
            <p>About Us</p>
            <p>Contact</p>
            <p>News</p>
            <p>Support</p>
          </div>

          <div className={styles.col}>
            <h3>STAY UP TO DATE</h3>
            <div className={styles.inputGroup}>
              <input placeholder="Enter your email" />
              <button>SUBMIT</button>
            </div>
          </div>
        </div>

        <hr className={styles.line} />

        <div className={styles.bottom}>
          <span>Terms</span>
          <span>Privacy</span>
          <span>Cookies</span>
        </div>
      </div>
    </footer>
  );
}
