// src/services/productService.js

const PRODUCT_API = "http://huytran1611-001-site1.anytempurl.com/api/products";
const REVIEW_API = "http://huytran1611-001-site1.anytempurl.com/api/Reviews/product";

// Lấy danh sách sản phẩm kèm rating
export async function getProductsWithRating() {
  const productRes = await fetch(PRODUCT_API);
  const products = await productRes.json();

  const productsWithRating = await Promise.all(
    products.map(async (product) => {
      try {
        const reviewRes = await fetch(`${REVIEW_API}/${product.productID}`);
        const reviews = await reviewRes.json();

        let rating = "5.0";

        if (Array.isArray(reviews) && reviews.length > 0) {
          const visibleReviews = reviews.filter((r) => !r.isHidden);
          if (visibleReviews.length > 0) {
            const total = visibleReviews.reduce((sum, r) => sum + r.rating, 0);
            rating = (total / visibleReviews.length).toFixed(1);
          }
        }

        return {
          ...product,
          rating,
        };
      } catch (error) {
        return {
          ...product,
          rating: "5.0",
        };
      }
    })
  );

  return productsWithRating;
}

// Lấy reviews cho 1 sản phẩm
export async function getProductReviews(productId) {
  try {
    const response = await fetch(`${REVIEW_API}/${productId}`);
    const reviews = await response.json();

    // Lọc các review không bị ẩn
    return reviews.filter((review) => !review.isHidden);
  } catch (error) {
    console.error("Lỗi lấy reviews:", error);
    return [];
  }
}

// Tính rating trung bình cho 1 sản phẩm
export async function getAverageRating(productId) {
  try {
    const reviews = await getProductReviews(productId);

    if (reviews.length === 0) {
      return { average: "5.0", total: 0 };
    }

    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const average = (total / reviews.length).toFixed(1);

    return { average, total: reviews.length };
  } catch (error) {
    console.error("Lỗi tính rating:", error);
    return { average: "5.0", total: 0 };
  }
}
