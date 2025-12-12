import styles from "./CategoryFilter.module.css";

export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <aside className={styles.filter}>
      <h3>Danh mục</h3>

      <button
        className={!active ? styles.active : ""}
        onClick={() => onChange(null)}
      >
        Tất cả
      </button>

      {categories.map((cat) => (
        <button
          key={cat.categoryID}
          className={active === cat.categoryID ? styles.active : ""}
          onClick={() => onChange(cat.categoryID)}
        >
          {cat.categoryName}
        </button>
      ))}
    </aside>
  );
}
