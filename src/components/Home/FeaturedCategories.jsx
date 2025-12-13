import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FeaturedCategories.module.css";

export default function FeaturedCategories() {
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://localhost:7298/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < totalPages - 1;

  const visibleCategories = categories.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleCategoryClick = (categoryID) => {
    navigate(`/shop?category=${categoryID}`);
  };

  if (categories.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Danh mục sản phẩm</h2>
          <p className={styles.subtitle}>
            Khám phá các danh mục thời trang đa dạng của chúng tôi
          </p>
        </div>

        <div className={styles.carouselWrapper}>
          {categories.length > itemsPerPage && (
            <button
              className={`${styles.arrowBtn} ${styles.prevBtn}`}
              onClick={handlePrev}
              disabled={!canGoPrev}
            >
              ‹
            </button>
          )}

          <div className={styles.grid}>
            {visibleCategories.map((category) => (
              <div
                key={category.categoryID}
                className={styles.categoryCard}
                onClick={() => handleCategoryClick(category.categoryID)}
              >
                <div className={styles.iconBox}>
                  <span className={styles.icon}>🏷️</span>
                </div>
                <h3 className={styles.categoryName}>{category.categoryName}</h3>
                <p className={styles.description}>{category.description}</p>
              </div>
            ))}
          </div>

          {categories.length > itemsPerPage && (
            <button
              className={`${styles.arrowBtn} ${styles.nextBtn}`}
              onClick={handleNext}
              disabled={!canGoNext}
            >
              ›
            </button>
          )}
        </div>

        {totalPages > 1 && (
          <div className={styles.dots}>
            {[...Array(totalPages)].map((_, index) => (
              <span
                key={index}
                className={`${styles.dot} ${
                  index === currentIndex ? styles.activeDot : ""
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
