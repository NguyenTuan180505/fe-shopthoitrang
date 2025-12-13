import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ReviewList.css';
import { getReviewsByProductId, deleteReview } from '../../api/reviewApi';

export default function ReviewList() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [productName, setProductName] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ============================
  // FETCH REVIEWS
  // ============================
  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      try {
        const res = await getReviewsByProductId(productId);

        if (res.data && res.data.length > 0) {
          setProductName(res.data[0].productName || '');
        }

        const mappedReviews = res.data
          .filter(r => !r.isHidden)
          .map(r => ({
            id: r.reviewID,
            title: r.comment ? r.comment.slice(0, 50) : 'Đánh giá sản phẩm',
            author: r.fullName,
            rating: r.rating,
            date: new Date(r.createdAt),
            dateString: new Date(r.createdAt).toLocaleDateString('vi-VN'),
            content: r.comment,
            helpful: Math.floor(Math.random() * 50),
            size: null,
            height: null,
            height_cm: null,
            weight: null,
            material: null,
            location: null,
          }));

        setReviews(mappedReviews);
      } catch (err) {
        console.error('Lỗi lấy review:', err);
      }
    };

    fetchReviews();
  }, [productId]);

  // ============================
  // DELETE REVIEW
  // ============================
  const handleDeleteReview = async (reviewId) => {
    setLoading(true);
    try {
      await deleteReview(reviewId);
      // Xóa review khỏi state
      setReviews(reviews.filter(r => r.id !== reviewId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Lỗi xóa review:', err);
      setDeleteConfirm(null);
    } finally {
      setLoading(false);
    }
  };

  const handleWriteReview = () => {
    navigate(`/reviews/${productId}/write`);
  };

  // ============================
  // CALCULATIONS
  // ============================
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  // ============================
  // FILTER & SORT REVIEWS
  // ============================
  let filteredReviews = reviews.filter(r => {
    if (filterRating === 'all') return true;
    return r.rating === parseInt(filterRating);
  });

  filteredReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'oldest') {
      return new Date(a.date) - new Date(b.date);
    } else if (sortBy === 'helpful') {
      return b.helpful - a.helpful;
    }
    return 0;
  });

  // ============================
  // RENDER
  // ============================
  return (
    <div className="review-list-container">
      <div className="review-header-section">
        <div className="breadcrumb">
          <span className="breadcrumb-link" onClick={() => navigate('/')}>Trang chủ</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{productName || 'Đánh giá'}</span>
        </div>
        <h1 className="page-title">Đánh giá khách hàng</h1>
        {productName && <p className="product-info">Sản phẩm: <strong>{productName}</strong></p>}

        <div className="review-overview">
          <div className="rating-stats">
            <div className="rating-header">
              <div className="rating-number">{avgRating}</div>
              <div>
                <div className="stars-big">
                  {'★'.repeat(Math.round(avgRating))}
                  {'☆'.repeat(5 - Math.round(avgRating))}
                </div>
                <div className="review-count">dựa trên {reviews.length} đánh giá</div>
              </div>
            </div>

            <div className="rating-counts">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="rating-row">
                  <div className="stars-small">
                    {'★'.repeat(rating)}
                    {'☆'.repeat(5 - rating)}
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width:
                          reviews.length > 0
                            ? `${(ratingCounts[rating] / reviews.length) * 100}%`
                            : '0%',
                      }}
                    ></div>
                  </div>
                  <div className="count-number">{ratingCounts[rating]}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="filter-rating-section">
            <label className="filter-rating-label">Lọc theo đánh giá:</label>
            <div className="filter-rating-buttons">
              {['all', 5, 4, 3, 2, 1].map(rating => (
                <button
                  key={rating}
                  className={`filter-btn ${filterRating === rating.toString() ? 'active' : ''}`}
                  onClick={() => setFilterRating(rating.toString())}
                >
                  {rating === 'all' ? (
                    'Tất cả'
                  ) : (
                    <>
                      <span className="filter-stars">
                        {'★'.repeat(rating)}
                      </span>
                      <span className="filter-count">({ratingCounts[rating]})</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Sort Section */}
      <div className="filter-section">
        <div className="filter-controls">
          <div className="sort-group">
            <label className="filter-label">Sắp xếp theo:</label>
            <div className="sort-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === 'newest'}
                  onChange={() => setSortBy('newest')}
                />
                <span>Mới nhất</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === 'oldest'}
                  onChange={() => setSortBy('oldest')}
                />
                <span>Cũ nhất</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === 'helpful'}
                  onChange={() => setSortBy('helpful')}
                />
                <span>Hữu ích nhất</span>
              </label>
            </div>
          </div>
        </div>

        <button className="btn-write-review" onClick={handleWriteReview}>
          <span className="btn-icon">+</span>
          VIẾT BÀI ĐÁNH GIÁ
        </button>
      </div>

      {/* Reviews List */}
      <div className="reviews-section">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review, index) => (
            <div key={review.id} className="review-item" style={{animationDelay: `${index * 0.05}s`}}>
              <div className="review-header">
                <div className="review-info">
                  <div className="review-rating">
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </div>
                  <h3 className="review-title">{review.title}</h3>
                  <p className="review-author">Bởi <strong>{review.author}</strong></p>
                </div>
                <div className="review-date">{review.dateString}</div>
              </div>

              <p className="review-content">{review.content}</p>

              <div className="review-meta">
                {review.size && <span className="meta-item">Kích cỡ: {review.size}</span>}
                {review.height && <span className="meta-item">{review.height}</span>}
                {review.height_cm && <span className="meta-item">Chiều cao: {review.height_cm}</span>}
                {review.weight && <span className="meta-item">Cân nặng: {review.weight}</span>}
                {review.material && <span className="meta-item">Chất liệu: {review.material}</span>}
                {review.location && <span className="meta-item">{review.location}</span>}
              </div>

              <div className="review-footer">
                <button className="helpful-btn" title="Bài đánh giá này hữu ích">
                  👍 Hữu ích ({review.helpful})
                </button>
                
                {deleteConfirm === review.id ? (
                  <div className="delete-confirm">
                    <span className="confirm-text">Bạn chắc chắn muốn xóa?</span>
                    <button 
                      className="btn-delete-yes" 
                      onClick={() => handleDeleteReview(review.id)}
                      disabled={loading}
                    >
                      {loading ? 'Đang xóa...' : 'Có'}
                    </button>
                    <button 
                      className="btn-delete-no" 
                      onClick={() => setDeleteConfirm(null)}
                      disabled={loading}
                    >
                      Không
                    </button>
                  </div>
                ) : (
                  <button 
                    className="delete-btn" 
                    onClick={() => setDeleteConfirm(review.id)}
                    title="Xóa đánh giá này"
                  >
                    🗑️ Xóa
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-reviews">
            <div className="no-reviews-icon">📭</div>
            <p>Không có đánh giá nào phù hợp với bộ lọc này</p>
          </div>
        )}
      </div>

      <div className="review-buttons">
        <button className="btn-submit" onClick={handleWriteReview}>
          VIẾT BÀI ĐÁNH GIÁ
        </button>
        <button className="btn-cancel" onClick={() => navigate('/')}>HỦY</button>
      </div>
    </div>
  );
}