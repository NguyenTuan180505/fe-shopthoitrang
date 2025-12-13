import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./ProductDetailPage.module.css";
import { cartService } from "../../services/cart.service";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

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

  const finalPrice = product.price - (product.price * product.discount) / 100;
  const formatVND = (v) => v.toLocaleString("vi-VN") + " ₫";

  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.categoryName === product.categoryName &&
        p.productID !== product.productID
    )
    .slice(0, 4);

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await cartService.addToCart(product.productID, quantity);

      // Hiệu ứng thông báo thành công
      const successMsg = document.createElement("div");
      successMsg.className = styles.successToast;
      successMsg.textContent = "✓ Đã thêm vào giỏ hàng";
      document.body.appendChild(successMsg);

      setTimeout(() => successMsg.remove(), 2000);
    } catch (error) {
      console.error("Lỗi thêm vào giỏ:", error);
      if (error.response?.status === 401) {
        alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
      } else {
        alert("Không thể thêm sản phẩm vào giỏ");
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.imageBox}>
          {product.discount > 0 && (
            <div className={styles.badge}>-{product.discount}%</div>
          )}
          <img src={product.imageUrl} alt={product.productName} />
        </div>

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

          <div className={styles.qtyRow}>
            <button onClick={decreaseQty}>-</button>
            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) =>
                setQuantity(Math.max(1, Number(e.target.value) || 1))
              }
            />
            <button onClick={increaseQty}>+</button>
          </div>

          <button
            className={styles.buyBtn}
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? "Đang thêm..." : "🛒 Thêm vào giỏ hàng"}
          </button>
        </div>
      </div>

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
                <img src={item.imageUrl} alt={item.productName} />
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
