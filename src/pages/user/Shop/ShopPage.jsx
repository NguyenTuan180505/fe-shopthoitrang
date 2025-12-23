import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CategoryFilter from "../../../components/Shop/CategoryFilter";
import ShopProductCard from "../../../components/Shop/ShopProductCard";
import ProductSearch from "../../../components/Shop/ProductSearch";
import styles from "./ShopPage.module.css";

export default function ShopPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [activeCategory, setActiveCategory] = useState(
    categoryFromUrl ? Number(categoryFromUrl) : null
  );

  useEffect(() => {
    fetch("http://huytran1611-001-site1.anytempurl.com/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));

    fetch("http://huytran1611-001-site1.anytempurl.com/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  // Đồng bộ khi user vào từ Trang chủ
  useEffect(() => {
    if (categoryFromUrl) {
      setActiveCategory(Number(categoryFromUrl));
    } else {
      setActiveCategory(null);
    }
  }, [categoryFromUrl]);

  // Lọc sản phẩm theo category và search term
  const filteredProducts = products.filter((product) => {
    // Lọc theo category nếu có
    const matchCategory = activeCategory
      ? product.categoryID === activeCategory
      : true;

    // Lọc theo search term nếu có
    const matchSearch = searchTerm
      ? product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchCategory && matchSearch;
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className={styles.shop}>
      <div className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>Mua hàng tiện lợi</h1>
          <p className={styles.heroSubtitle}>
            Mua sắm các sản phẩm thời trang mới nhất từ cửa hàng của chúng tôi
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <ProductSearch onSearch={handleSearch} />

        <div className={styles.layout}>
          <CategoryFilter
            categories={categories}
            active={activeCategory}
            onChange={setActiveCategory}
          />

          <div className={styles.content}>
            {filteredProducts.length > 0 ? (
              <div className={styles.grid}>
                {filteredProducts.map((product) => (
                  <ShopProductCard key={product.productID} product={product} />
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <svg
                  width="64"
                  height="64"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: "#9ca3af", marginBottom: "16px" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 20h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>
                  {searchTerm
                    ? `Không có sản phẩm nào phù hợp với "${searchTerm}"`
                    : "Không có sản phẩm nào trong danh mục này"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
