import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProductReviews.module.css";

export default function ProductReviews({ productId }) {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  useEffect(() => {
    applyFilter();
  }, [selectedFilter, reviews]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://localhost:7298/api/Reviews/product/${productId}`
      );
      const data = await response.json();

      // Lọc reviews không bị ẩn
      const visibleReviews = data.filter((review) => !review.isHidden);
      setReviews(visibleReviews);

      // Tính toán thống kê
      if (visibleReviews.length > 0) {
        const total = visibleReviews.reduce((sum, r) => sum + r.rating, 0);
        const average = (total / visibleReviews.length).toFixed(1);

        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        visibleReviews.forEach((review) => {
          breakdown[review.rating]++;
        });

        setStats({
          averageRating: average,
          totalReviews: visibleReviews.length,
          ratingBreakdown: breakdown,
        });
      }
    } catch (error) {
      console.error("Lỗi tải đánh giá:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    if (selectedFilter === "all") {
      setFilteredReviews(reviews);
    } else {
      const filtered = reviews.filter(
        (review) => review.rating === parseInt(selectedFilter)
      );
      setFilteredReviews(filtered);
    }
    setShowAll(false);
  };

  const handleFilterChange = (rating) => {
    setSelectedFilter(rating);
  };

  const handleWriteReview = () => {
    navigate(`/reviews/${productId}/write`);
  };

  const renderStars = (rating) => {
    return (
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? styles.starFilled : styles.starEmpty}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Đang tải đánh giá...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={styles.noReviewsContainer}>
        <div className={styles.noReviews}>
          <div className={styles.noReviewsIcon}>💬</div>
          <h3>Chưa có đánh giá</h3>
          <p>Hãy là người đầu tiên đánh giá sản phẩm này!</p>
        </div>
        <button className={styles.writeReviewBtn} onClick={handleWriteReview}>
          ✍️ Viết đánh giá
        </button>
      </div>
    );
  }

  const displayedReviews = showAll
    ? filteredReviews
    : filteredReviews.slice(0, 3);
  const hasMore = filteredReviews.length > 3;

  return (
    <div className={styles.reviewsSection}>
      <div className={styles.titleWithButton}>
        <h2 className={styles.title}>Đánh giá sản phẩm</h2>
        <button className={styles.writeReviewBtn} onClick={handleWriteReview}>
          ✍️ Viết đánh giá
        </button>
      </div>

      {/* Rating Summary */}
      <div className={styles.summary}>
        <div className={styles.summaryLeft}>
          <div className={styles.averageRating}>{stats.averageRating}</div>
          {renderStars(Math.round(stats.averageRating))}
          <p className={styles.totalReviews}>{stats.totalReviews} đánh giá</p>
        </div>

        <div className={styles.summaryRight}>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.ratingBreakdown[star];
            const percentage =
              stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

            return (
              <div key={star} className={styles.ratingBar}>
                <span className={styles.starLabel}>{star} ★</span>
                <div className={styles.barWrapper}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className={styles.ratingCount}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Lọc theo:</h3>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterBtn} ${
              selectedFilter === "all" ? styles.filterActive : ""
            }`}
            onClick={() => handleFilterChange("all")}
          >
            Tất cả ({reviews.length})
          </button>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.ratingBreakdown[star];
            if (count === 0) return null;

            return (
              <button
                key={star}
                className={`${styles.filterBtn} ${
                  selectedFilter === star.toString() ? styles.filterActive : ""
                }`}
                onClick={() => handleFilterChange(star.toString())}
              >
                {star} ★ ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className={styles.noFilterResults}>
          <p>Không có đánh giá nào với bộ lọc này</p>
        </div>
      ) : (
        <>
          <div className={styles.reviewsList}>
            {displayedReviews.map((review) => (
              <div key={review.reviewID} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewUser}>
                    <div className={styles.avatar}>
                      {review.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.userInfo}>
                      <h4 className={styles.userName}>{review.fullName}</h4>
                      <p className={styles.reviewDate}>
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>

                <p className={styles.comment}>{review.comment}</p>

                {/* Images */}
                {review.imageUrls && review.imageUrls.length > 0 && (
                  <div className={styles.mediaGrid}>
                    {review.imageUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Review ${index + 1}`}
                        className={styles.reviewImage}
                      />
                    ))}
                  </div>
                )}

                {/* Videos */}
                {review.videoUrls && review.videoUrls.length > 0 && (
                  <div className={styles.mediaGrid}>
                    {review.videoUrls.map((url, index) => (
                      <video
                        key={index}
                        src={url}
                        controls
                        className={styles.reviewVideo}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {hasMore && (
            <div className={styles.showMoreWrapper}>
              <button
                className={styles.showMoreBtn}
                onClick={() => setShowAll(!showAll)}
              >
                {showAll
                  ? "Thu gọn"
                  : `Xem thêm ${filteredReviews.length - 3} đánh giá`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}