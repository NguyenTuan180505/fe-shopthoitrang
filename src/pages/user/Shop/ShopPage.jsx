import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CategoryFilter from "../../../components/Shop/CategoryFilter";
import ShopProductCard from "../../../components/Shop/ShopProductCard";
import styles from "./ShopPage.module.css";

export default function ShopPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [activeCategory, setActiveCategory] = useState(
    categoryFromUrl ? Number(categoryFromUrl) : null
  );

  useEffect(() => {
    fetch("https://localhost:7298/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));

    fetch("https://localhost:7298/api/products")
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

  const filteredProducts = activeCategory
    ? products.filter((p) => p.categoryID === activeCategory)
    : products;

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
        <div className={styles.layout}>
          <CategoryFilter
            categories={categories}
            active={activeCategory}
            onChange={setActiveCategory}
          />

          <div className={styles.grid}>
            {filteredProducts.map((product) => (
              <ShopProductCard key={product.productID} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
