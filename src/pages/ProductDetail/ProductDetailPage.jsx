import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./ProductDetailPage.module.css";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const increaseQty = () => setQuantity((prev) => prev + 1);

  const decreaseQty = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    fetch("https://localhost:7298/api/products")
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);

        const found = data.find((p) => p.productID === Number(id));
        setProduct(found);
      });
  }, [id]);

  if (!product) return <p className={styles.loading}>Đang tải sản phẩm...</p>;

  // Vì discount từ API là đơn vị %, ví dụ 10 = 10%
  const finalPrice = product.price - (product.price * product.discount) / 100;

  const formatVND = (v) => v.toLocaleString("vi-VN") + " ₫";

  // sản phẩm tương tự cùng danh mục
  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.categoryName === product.categoryName &&
        p.productID !== product.productID
    )
    .slice(0, 4);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* IMAGE */}
        <div className={styles.imageBox}>
          {product.discount > 0 && (
            <div className={styles.badge}>-{product.discount}%</div>
          )}

          <img
            src={product.imageUrl}
            alt={product.productName}
            onError={(e) => (e.target.src = "/no-image.png")}
          />
        </div>

        {/* INFO */}
        <div className={styles.info}>
          <h1 className={styles.title}>{product.productName}</h1>

          <div className={styles.priceBox}>
            {product.discount > 0 && (
              <span className={styles.oldPrice}>
                {formatVND(product.price)}
              </span>
            )}
            <span className={styles.finalPrice}>{formatVND(finalPrice)}</span>
          </div>

          <p className={styles.desc}>{product.description}</p>

          <p className={styles.stock}>
            Tồn kho: <strong>{product.stock}</strong>
          </p>

          {/* Quantity */}
          <div className={styles.qtyRow}>
            <button onClick={decreaseQty}>-</button>

            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                setQuantity(val < 1 ? 1 : val);
              }}
            />

            <button onClick={increaseQty}>+</button>
          </div>

          <button className={styles.buyBtn}>Thêm vào giỏ hàng</button>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className={styles.relatedSection}>
        <h2>Sản phẩm tương tự</h2>

        <div className={styles.relatedList}>
          {relatedProducts.length === 0 && <p>Không có sản phẩm tương tự.</p>}

          {relatedProducts.map((item) => (
            <div
              key={item.productID}
              className={styles.relatedCard}
              onClick={() => navigate(`/product/${item.productID}`)}
            >
              <div className={styles.relatedThumb}>
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  onError={(e) => (e.target.src = "/no-image.png")}
                />
              </div>

              <p className={styles.relatedName}>{item.productName}</p>

              <p className={styles.relatedPrice}>
                {formatVND(item.price - (item.price * item.discount) / 100)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
