import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import styles from "./ProductTabs.module.css";

export default function ProductTabs({ products }) {
  const [activeTab, setActiveTab] = useState("hot");
  const [page, setPage] = useState(1);
  const [hotCache, setHotCache] = useState([]);

  const itemsPerPage = 8;

  // Random HOT products 1 lần duy nhất
  useEffect(() => {
    const randomHot = [...products].sort(() => 0.5 - Math.random()).slice(0, 8);

    setHotCache(randomHot);
  }, [products]);

  // Filter logic
  let filtered = [];

  switch (activeTab) {
    case "sale":
      filtered = products.filter((p) => p.discount > 0);
      break;

    case "hot":
      filtered = hotCache;
      break;

    case "new":
      filtered = [...products]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8);
      break;

    default:
      filtered = [];
  }

  // Pagination only for sale tab
  const totalPages =
    activeTab === "sale" ? Math.ceil(filtered.length / itemsPerPage) : 1;

  const paginated =
    activeTab === "sale"
      ? filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)
      : filtered;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Our products</h2>

      {/* TAB BUTTONS */}
      <div className={styles.tabs}>
        {["sale", "hot", "new"].map((tab) => (
          <button
            key={tab}
            className={`${styles.tabButton} ${
              activeTab === tab ? styles.activeTab : ""
            }`}
            onClick={() => {
              setActiveTab(tab);
              setPage(1);
            }}
          >
            {tab === "sale" && "SALE"}
            {tab === "hot" && "HOT"}
            {tab === "new" && "NEW ARRIVALS"}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className={styles.grid}>
        {paginated.map((p) => (
          <ProductCard key={p.productID} product={p} />
        ))}
      </div>

      {/* PAGINATION ONLY FOR SALE */}
      {activeTab === "sale" && totalPages > 1 && (
        <div className={styles.pagination}>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            {"<"}
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            {">"}
          </button>
        </div>
      )}
    </div>
  );
}
