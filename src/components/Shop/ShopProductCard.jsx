import styles from "./ShopProductCard.module.css";
import { Link } from "react-router-dom";
export default function ShopProductCard({ product }) {
  const finalPrice = product.price - (product.discount * product.price) / 100;
  const formatVND = (v) => v.toLocaleString("vi-VN") + " VND";

  return (
    <div className={styles.card}>
      <div
        className={styles.image}
        style={{ backgroundImage: `url(${product.imageUrl})` }}
      >
        {product.discount > 0 && <span className={styles.badge}>SALE</span>}
      </div>

      <h4 className={styles.name}>{product.productName}</h4>

      <div className={styles.price}>
        {product.discount > 0 && (
          <span className={styles.old}>{formatVND(product.price)}</span>
        )}
        <span>{formatVND(finalPrice)}</span>
      </div>

      <p className={styles.stock}>Còn {product.stock} sản phẩm</p>

      <Link to={`/product/${product.productID}`} className={styles.btn}>
        Xem chi tiết
      </Link>
    </div>
  );
}
