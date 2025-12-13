import { useState } from "react";
import { createPortal } from "react-dom";
import styles from "./CartItem.module.css";

const CartItem = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const { product, quantity, unitPrice, cartItemID } = item;
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const priceAfterDiscount = unitPrice - (unitPrice * product.discount) / 100;
  const totalPrice = priceAfterDiscount * quantity;

  const handleUpdateQuantity = async (newQuantity) => {
    if (newQuantity < 1 || isUpdating) return;

    setIsUpdating(true);
    try {
      await onUpdateQuantity(cartItemID, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await onRemoveItem(cartItemID);
    } finally {
      setIsUpdating(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className={styles.cartItem}>
        {/* Delete Button */}
        <button
          className={styles.deleteBtn}
          onClick={() => setShowConfirm(true)}
          disabled={isUpdating}
          title="Xóa sản phẩm"
        >
          <svg
            className={styles.deleteIcon}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 6H5H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className={styles.imageWrapper}>
          <div
            className={styles.image}
            style={{ backgroundImage: `url(${product.imageUrl})` }}
          ></div>
          {product.discount > 0 && (
            <span className={styles.discountBadge}>-{product.discount}%</span>
          )}
        </div>

        <div className={styles.info}>
          <h3 className={styles.name}>{product.productName}</h3>
          <p className={styles.desc}>{product.description}</p>

          {/* Quantity Controls */}
          <div className={styles.quantityControl}>
            <button
              className={styles.qtyBtn}
              onClick={() => handleUpdateQuantity(quantity - 1)}
              disabled={isUpdating || quantity <= 1}
            >
              <svg
                className={styles.qtyBtnIcon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <span className={styles.qtyDisplay}>{quantity}</span>

            <button
              className={styles.qtyBtn}
              onClick={() => handleUpdateQuantity(quantity + 1)}
              disabled={isUpdating}
            >
              <svg
                className={styles.qtyBtnIcon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5V19M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.priceBox}>
          {/* Giá gốc (1 sản phẩm) */}
          {product.discount > 0 && (
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>Giá gốc:</span>
              <span className={styles.oldPrice}>
                {unitPrice.toLocaleString()} đ
              </span>
            </div>
          )}

          {/* Giá sau giảm (1 sản phẩm) */}
          <div className={styles.priceRow}>
            <span className={styles.priceLabel}>
              {product.discount > 0 ? "Giá KM:" : "Đơn giá:"}
            </span>
            <span className={styles.discountPrice}>
              {priceAfterDiscount.toLocaleString()} đ
            </span>
          </div>

          {/* Tổng tiền (sau khi nhân số lượng) */}
          <div className={styles.totalPriceRow}>
            <span className={styles.totalLabel}>Tổng:</span>
            <span className={styles.totalPrice}>
              {totalPrice.toLocaleString()} đ
            </span>
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal - Render outside using Portal */}
      {showConfirm &&
        createPortal(
          <div
            className={styles.confirmOverlay}
            onClick={() => setShowConfirm(false)}
          >
            <div
              className={styles.confirmModal}
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                className={styles.confirmIcon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <h3 className={styles.confirmTitle}>Xóa sản phẩm?</h3>
              <p className={styles.confirmText}>
                Bạn có chắc muốn xóa "<strong>{product.productName}</strong>"
                khỏi giỏ hàng?
              </p>
              <div className={styles.confirmActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setShowConfirm(false)}
                  disabled={isUpdating}
                >
                  Hủy
                </button>
                <button
                  className={styles.confirmBtn}
                  onClick={handleRemove}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default CartItem;
