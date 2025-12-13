import { useEffect, useState } from "react";
import { cartService } from "../../services/cart.service";
import CartItem from "../../components/Cart/CartItem";
import styles from "./CartPage.module.css";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await cartService.getCart();
      setCart(res.data);
    } catch (error) {
      console.error("Lỗi tải giỏ hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    try {
      await cartService.updateCartItem(cartItemId, newQuantity);
      await fetchCart();
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
      alert("Không thể cập nhật số lượng. Vui lòng thử lại!");
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await cartService.removeCartItem(cartItemId);
      await fetchCart();
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
      alert("Không thể xóa sản phẩm. Vui lòng thử lại!");
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className={styles.emptyWrapper}>
        <div className={styles.emptyCart}>
          <svg
            className={styles.emptyIcon}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 2L7.17 4H4C2.9 4 2 4.9 2 6V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V6C22 4.9 21.1 4 20 4H16.83L15 2H9ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z"
              fill="currentColor"
            />
          </svg>
          <h2 className={styles.emptyTitle}>Giỏ hàng trống</h2>
          <p className={styles.emptyText}>
            Hãy thêm sản phẩm yêu thích vào giỏ hàng nhé!
          </p>
          <button
            className={styles.shopButton}
            onClick={() => (window.location.href = "/shop")}
          >
            Khám phá ngay
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = cart.cartItems.reduce((sum, item) => {
    const price =
      item.unitPrice - (item.unitPrice * item.product.discount) / 100;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className={styles.cartPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <svg
              className={styles.titleIcon}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 2L7.17 4H4C2.9 4 2 4.9 2 6V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V6C22 4.9 21.1 4 20 4H16.83L15 2H9Z"
                fill="currentColor"
              />
            </svg>
            Giỏ hàng của bạn
          </h1>
          <p className={styles.subtitle}>{cart.cartItems.length} sản phẩm</p>
        </div>

        <div className={styles.content}>
          <div className={styles.cartList}>
            {cart.cartItems.map((item) => (
              <CartItem
                key={item.cartItemID}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            ))}
          </div>

          <div className={styles.sidebar}>
            <div className={styles.summary}>
              <h2 className={styles.summaryTitle}>Tóm tắt đơn hàng</h2>

              <div className={styles.summaryRow}>
                <span className={styles.label}>Tạm tính:</span>
                <span className={styles.value}>
                  {totalPrice.toLocaleString()} đ
                </span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.label}>Phí vận chuyển:</span>
                <span className={styles.freeShipping}>Miễn phí</span>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Tổng cộng:</span>
                <span className={styles.total}>
                  {totalPrice.toLocaleString()} đ
                </span>
              </div>

              <button className={styles.checkoutBtn}>
                <svg
                  className={styles.checkoutIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 13L9 17L19 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Thanh toán
              </button>

              <div className={styles.badges}>
                <div className={styles.badgeItem}>
                  <svg
                    className={styles.badgeIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className={styles.badgeText}>Đổi trả trong 7 ngày</span>
                </div>
                <div className={styles.badgeItem}>
                  <svg
                    className={styles.badgeIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 15V3M12 15L8 11M12 15L16 11M2 17L2 19C2 20.1046 2.89543 21 4 21L20 21C21.1046 21 22 20.1046 22 19V17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className={styles.badgeText}>Miễn phí vận chuyển</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
