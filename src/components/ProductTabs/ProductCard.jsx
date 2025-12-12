import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const finalPrice = product.price - (product.discount * product.price) / 100;

  const formatVND = (value) => value.toLocaleString("vi-VN") + " VND";

  return (
    <div className={styles.card}>
      {/* IMAGE */}
      <div
        className={styles.image}
        style={{ backgroundImage: `url(${product.imageUrl})` }}
      ></div>

      {/* PRODUCT NAME */}
      <h4 className={styles.name}>{product.productName}</h4>

      {/* PRICE + RATING */}
      <div className={styles.infoRow}>
        <div className={styles.priceBlock}>
          {product.discount > 0 ? (
            <>
              <span className={styles.oldPrice}>
                {formatVND(product.price)}
              </span>
              <span className={styles.price}>{formatVND(finalPrice)}</span>
            </>
          ) : (
            <span className={styles.price}>{formatVND(product.price)}</span>
          )}
        </div>

        <div className={styles.rating}>
          {product.rating ?? 4.9}
          <span className={styles.star}>★</span>
        </div>
      </div>
    </div>
  );
}
