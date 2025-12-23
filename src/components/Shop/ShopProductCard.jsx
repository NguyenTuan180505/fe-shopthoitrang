import styles from "./ShopProductCard.module.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ShopProductCard({ product }) {
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const finalPrice = product.price - (product.discount * product.price) / 100;
  const formatVND = (v) => v.toLocaleString("vi-VN") + " VND";

  useEffect(() => {
    fetchAverageRating();
  }, [product.productID]);

  const fetchAverageRating = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://huytran1611-001-site1.anytempurl.com/api/Reviews/product/${product.productID}`
      );
      const data = await response.json();

      // Lọc reviews không bị ẩn
      const visibleReviews = data.filter((review) => !review.isHidden);

      if (visibleReviews.length > 0) {
        const total = visibleReviews.reduce((sum, r) => sum + r.rating, 0);
        const average = (total / visibleReviews.length).toFixed(1);
        setAverageRating(average);
      }
    } catch (error) {
      console.error("Lỗi tải đánh giá:", error);
      setAverageRating(0);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= Math.round(rating) ? styles.starFilled : styles.starEmpty}
          >
            ★
          </span>
        ))}
        <span className={styles.ratingText}>({rating})</span>
      </div>
    );
  };

  const renderRatingPlaceholder = () => {
    return (
      <div className={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={styles.starEmpty}>
            ★
          </span>
        ))}
        <span className={styles.ratingText}>(0.0)</span>
      </div>
    );
  };

  return (
    <div className={styles.card}>
      <div
        className={styles.image}
        style={{ backgroundImage: `url(${product.imageUrl})` }}
      >
        {product.discount > 0 && <span className={styles.badge}>SALE</span>}
      </div>

      <h4 className={styles.name}>{product.productName}</h4>

      {!loading && (averageRating > 0 ? renderStars(averageRating) : renderRatingPlaceholder())}

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