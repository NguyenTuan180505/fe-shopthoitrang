import { useEffect, useState } from "react";
import CategoryFilter from "../../components/Shop/CategoryFilter";
import ShopProductCard from "../../components/Shop/ShopProductCard";
import styles from "./ShopPage.module.css";

export default function ShopPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    fetch("https://localhost:7298/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));

    fetch("https://localhost:7298/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const filteredProducts = activeCategory
    ? products.filter((p) => p.categoryID === activeCategory)
    : products;

  return (
    <div className={styles.shop}>
      <div className={styles.container}>
        <h1 className={styles.title}>Shop</h1>

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
