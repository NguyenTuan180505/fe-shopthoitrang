import styles from "./Footer.module.css";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.col}>
            <h2>FASHION</h2>
            <p>Mạng xã hội</p>
            <div className={styles.icons}>
              <FaFacebook />
              <FaTwitter />
              <FaInstagram />
            </div>
          </div>

          <div className={styles.col}>
            <h3>CỬA HÀNG</h3>
            <p>Sản phẩm</p>
            <p>Tổng quan</p>
            <p>Bảng giá</p>
            <p>Bộ sưu tập mới</p>
          </div>

          <div className={styles.col}>
            <h3>CÔNG TY</h3>
            <p>Về chúng tôi</p>
            <p>Liên hệ</p>
            <p>Tin tức</p>
            <p>Hỗ trợ</p>
          </div>

          <div className={styles.col}>
            <h3>CẬP NHẬT THÔNG TIN</h3>
            <div className={styles.inputGroup}>
              <input placeholder="Nhập email của bạn" />
              <button>GỬI</button>
            </div>
          </div>
        </div>

        <hr className={styles.line} />

        <div className={styles.bottom}>
          <span>Điều khoản</span>
          <span>Quyền riêng tư</span>
          <span>Cookie</span>
        </div>
      </div>
    </footer>
  );
}
