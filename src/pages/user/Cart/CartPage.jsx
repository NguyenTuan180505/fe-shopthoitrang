import { useEffect, useState } from "react";
import { cartService } from "../../../services/cart.service";
import CartItem from "../../../components/Cart/CartItem";
import styles from "./CartPage.module.css";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await cartService.getCart();
      setCart(res.data);
      setSelectedItemIds([]); // reset selection
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

  // ===== CHECKBOX LOGIC =====
  const handleToggleItem = (cartItemId) => {
    setSelectedItemIds((prev) =>
      prev.includes(cartItemId)
        ? prev.filter((id) => id !== cartItemId)
        : [...prev, cartItemId]
    );
  };

  const isAllSelected =
    cart?.cartItems?.length > 0 &&
    selectedItemIds.length === cart.cartItems.length;

  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(cart.cartItems.map((i) => i.cartItemID));
    }
  };

  const handleCheckoutClick = () => {
    if (selectedItemIds.length === 0) {
      alert("Vui lòng chọn sản phẩm trong giỏ hàng");
      return;
    }

    navigate("/payment", {
      state: {
        selectedItemIds,
      },
    });
  };

  // ===== TOTAL PRICE (CHỈ ITEM ĐƯỢC CHỌN) =====
  const selectedTotalPrice =
    cart?.cartItems
      ?.filter((item) => selectedItemIds.includes(item.cartItemID))
      .reduce((sum, item) => {
        const price =
          item.unitPrice - (item.unitPrice * item.product.discount) / 100;
        return sum + price * item.quantity;
      }, 0) || 0;

  // ===== LOADING =====
  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Đang tải giỏ hàng...</p>
      </div>
    );
  }

  // ===== EMPTY CART =====
  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className={styles.emptyWrapper}>
        <div className={styles.emptyCart}>
          <h2 className={styles.emptyTitle}>Giỏ hàng trống</h2>
          <p className={styles.emptyText}>
            Hãy thêm sản phẩm yêu thích vào giỏ hàng nhé!
          </p>
          <button
            className={styles.shopButton}
            onClick={() => navigate("/shop")}
          >
            Khám phá ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>Giỏ hàng của bạn</h1>
          <p className={styles.subtitle}>{cart.cartItems.length} sản phẩm</p>
        </div>

        <div className={styles.content}>
          {/* CART LIST */}
          <div className={styles.cartList}>
            {/* SELECT ALL - Modern Design */}
            <div className={styles.selectAllCard}>
              <button
                className={`${styles.selectAllBtn} ${
                  isAllSelected ? styles.allSelected : ""
                }`}
                onClick={handleToggleAll}
              >
                <div className={styles.selectAllIndicator}>
                  <div
                    className={`${styles.indicator} ${
                      isAllSelected ? styles.active : ""
                    }`}
                  >
                    {isAllSelected && (
                      <svg
                        className={styles.checkIcon}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div className={styles.selectAllContent}>
                  <span className={styles.selectAllText}>
                    {isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                  </span>
                  <span className={styles.selectAllCounter}>
                    {selectedItemIds.length}/{cart.cartItems.length} sản phẩm
                  </span>
                </div>
                <svg
                  className={styles.selectAllArrow}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 5L16 12L9 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {cart.cartItems.map((item) => (
              <CartItem
                key={item.cartItemID}
                item={item}
                checked={selectedItemIds.includes(item.cartItemID)}
                onToggle={() => handleToggleItem(item.cartItemID)}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            ))}
          </div>

          {/* SIDEBAR */}
          <div className={styles.sidebar}>
            <div className={styles.summary}>
              <h2 className={styles.summaryTitle}>Tóm tắt đơn hàng</h2>

              <div className={styles.summaryRow}>
                <span className={styles.label}>Tạm tính:</span>
                <span className={styles.value}>
                  {selectedTotalPrice.toLocaleString()} đ
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
                  {selectedTotalPrice.toLocaleString()} đ
                </span>
              </div>

              <button
                className={styles.checkoutBtn}
                onClick={handleCheckoutClick}
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
