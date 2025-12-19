import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClientUser from "../../../api/axiosClientUser";
import VoucherModal from "./VoucherModal";
import QrPaymentModal from "./QrPaymentModal";
import InvoiceFormModal from "./InvoiceFormModal";

import "./payment.css";

export default function PaymentPage() {
  // ===== ROUTER STATE =====
  const location = useLocation();
  const navigate = useNavigate();
  const orderType = location.state?.orderType || "CART";
  const directItems = location.state?.items || [];
  const isDirectOrder = orderType === "DIRECT";
  const selectedItemIds = location.state?.selectedItemIds || [];
  const isSelectedCartOrder = !isDirectOrder && selectedItemIds.length > 0;

  // ===== STATE CHO USER =====
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ===== STATE CHO FORM =====
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState(null);

  // ===== STATE CHO TỈNH - HUYỆN - XÃ =====
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // ===== STATE CHO PHƯƠNG THỨC =====
  const [shippingMethod, setShippingMethod] = useState("2-3days");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // ===== STATE CHO CART DATA =====
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===== STATE CHO CHECKOUT =====
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // ===== STATE CHO VOUCHER =====
  const [voucher, setVoucher] = useState(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  // ===== STATE CHO INVOICE =====
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // ===== VALIDATION =====
  const [errors, setErrors] = useState({ phone: "" });

  const validatePhone = (value) => {
    const regex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    return regex.test(value);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    setPhone(value);

    if (value === "") {
      setErrors((prev) => ({ ...prev, phone: "Vui lòng nhập số điện thoại" }));
    } else if (!validatePhone(value)) {
      setErrors((prev) => ({ ...prev, phone: "Số điện thoại không hợp lệ" }));
    } else {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  // ===== ĐIỀN TỰ ĐỘNG THÔNG TIN USER =====
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosClientUser.get("/users/me");
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Lỗi lấy user:", err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };

    fetchUser();
  }, []);
  useEffect(() => {
    if (!isDirectOrder && selectedItemIds.length === 0) {
      alert("Vui lòng chọn sản phẩm để thanh toán");
      navigate("/cart", { replace: true });
    }
  }, [isDirectOrder, selectedItemIds, navigate]);

  useEffect(() => {
    if (user && !authLoading) {
      if (user.fullName) setFullName(user.fullName);
      if (user.phone) setPhone(user.phone);
    }
  }, [user, authLoading]);

  // ===== LẤY DỮ LIỆU GIỎ HÀNG (CHỈ KHI ORDER TỪ CART) =====
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        const response = await axiosClientUser.get("/Cart");
        const cart = response.data;

        if (isSelectedCartOrder) {
          cart.cartItems = cart.cartItems.filter((item) =>
            selectedItemIds.includes(item.cartItemID)
          );
        }

        setCartData(cart);

        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Lỗi khi lấy dữ liệu giỏ hàng");
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    // ✅ CHỈ FETCH CART KHI LÀ ORDER TỪ CART
    if (isAuthenticated && !isDirectOrder) {
      fetchCartData();
    } else if (isDirectOrder) {
      // ✅ DIRECT ORDER: không cần fetch, loading xong ngay
      setLoading(false);
    }
  }, [isAuthenticated, isDirectOrder]);

  // ===== LẤY DANH SÁCH TỈNH =====
  // useEffect(() => {
  //   fetch("https://provinces.open-api.vn/api/p/")
  //     .then((res) => res.json())
  //     .then((data) => setProvinces(data))
  //     .catch((err) => console.error("Error fetching provinces:", err));
  // }, []);
  useEffect(() => {
    fetch("https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1")
      .then((res) => res.json())
      .then((json) => {
        setProvinces(json.data.data || []);
      })
      .catch((err) => console.error("Error fetching provinces:", err));
  }, []);

  // ===== KHI CHỌN TỈNH → LẤY HUYỆN =====
  // useEffect(() => {
  //   if (!selectedProvince) return;

  //   fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setDistricts(data.districts || []);
  //       setWards([]);
  //       setSelectedDistrict("");
  //       setSelectedWard("");
  //     })
  //     .catch((err) => console.error("Error fetching districts:", err));
  // }, [selectedProvince]);
  useEffect(() => {
    if (!selectedProvince) return;

    fetch(
      `https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${selectedProvince}&limit=-1`
    )
      .then((res) => res.json())
      .then((json) => {
        setDistricts(json.data.data || []);
        setWards([]);
        setSelectedDistrict("");
        setSelectedWard("");
      })
      .catch((err) => console.error("Error fetching districts:", err));
  }, [selectedProvince]);

  // ===== KHI CHỌN HUYỆN → LẤY XÃ =====
  // useEffect(() => {
  //   if (!selectedDistrict) return;

  //   fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setWards(data.wards || []);
  //       setSelectedWard("");
  //     })
  //     .catch((err) => console.error("Error fetching wards:", err));
  // }, [selectedDistrict]);
  useEffect(() => {
    if (!selectedDistrict) return;

    fetch(
      `https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${selectedDistrict}&limit=-1`
    )
      .then((res) => res.json())
      .then((json) => {
        setWards(json.data.data || []);
        setSelectedWard("");
      })
      .catch((err) => console.error("Error fetching wards:", err));
  }, [selectedDistrict]);

  const isAddressComplete =
    fullName &&
    phone &&
    selectedProvince &&
    selectedDistrict &&
    selectedWard &&
    address &&
    !errors.phone;

  // ===== PAYMENT METHOD MAP =====
  const paymentMethodMap = {
    cod: "COD",
    vnpay: "VNPAY",
    shopeepay: "SHOPEEPAY",
  };

  // ===== HÀM ĐỊNH DẠO TIỀN TỆ =====
  const formatCurrency = (value) => {
    if (!value) return "0đ";
    return value.toLocaleString("vi-VN") + "đ";
  };

  // ===== CHỌN DỮ LIỆU SẢN PHẨM (CART HOẶC DIRECT) =====
  const productsToRender = isDirectOrder ? directItems : cartData?.cartItems;

  // ===== TÍNH TOÁN GIÁ TIỀN =====
  const originalPrice =
    productsToRender?.reduce((sum, item) => {
      return sum + item.unitPrice * item.quantity;
    }, 0) || 0;

  const discount =
    productsToRender?.reduce((sum, item) => {
      const discountPercent = item.product?.discountPercent || 0;
      const itemOriginalPrice = item.unitPrice * item.quantity;
      const itemDiscount = (itemOriginalPrice * discountPercent) / 100;
      return sum + itemDiscount;
    }, 0) || 0;

  const subtotal = originalPrice - discount;
  const voucherDiscount = voucher?.discountAmount || 0;
  const shippingFee = 0;
  const finalPrice = Math.max(subtotal - voucherDiscount + shippingFee, 0);

  // ===== HANDLER THANH TOÁN =====
  const handleCheckout = async () => {
    if (!isAddressComplete) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng");
      return;
    }

    // ✅ Ghép địa chỉ thành string đầy đủ
    const shippingAddress = `${address}, ${
      wards.find((w) => w.code == selectedWard)?.name
    }, ${districts.find((d) => d.code == selectedDistrict)?.name}, ${
      provinces.find((p) => p.code == selectedProvince)?.name
    }`;

    setCheckoutLoading(true);

    try {
      let orderRes;

      if (isDirectOrder) {
        // ✅ ORDER DIRECT (BUY NOW)
        console.log("Gọi API /Orders/direct");
        orderRes = await axiosClientUser.post("/Orders/direct", {
          shippingAddress,
          paymentMethod: paymentMethodMap[paymentMethod],
          items: directItems,
        });
      } else {
        // ✅ ORDER TỪ CART
        console.log("Gọi API /Orders/from-cart");
        orderRes = await axiosClientUser.post("/Orders/from-cart-selected", {
          cartItemIds: selectedItemIds,
          shippingAddress,
          paymentMethod: paymentMethodMap[paymentMethod],
        });
      }

      const orderId = orderRes.data.orderId;

      // ✅ COD: chỉ tạo order
      if (paymentMethod === "cod") {
        alert("Đặt hàng thành công! (COD)");
        navigate(`/profile/orders/${orderId}`, {
          replace: true,
        });
        return;
      }

      // ✅ VNPAY / SHOPEEPAY: mở QR DEMO
      if (paymentMethod === "vnpay" || paymentMethod === "shopeepay") {
        setPendingOrderId(orderId);
        setShowQr(true);
        return;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      const errorMsg = err.response?.data?.message || err.message;
      alert("Đặt hàng thất bại: " + errorMsg);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleConfirmQrPayment = async () => {
    try {
      if (!pendingOrderId) {
        console.error("Không tìm thấy order để thanh toán!");
        return;
      }

      await axiosClientUser.post("/Payments", {
        orderID: pendingOrderId,
        paymentMethod: paymentMethodMap[paymentMethod],
        transactionID: "QR-DEMO-" + Date.now(),
        amount: finalPrice,
      });

      setShowQr(false);

      // 👉 ĐIỀU HƯỚNG ĐÚNG
      navigate(`/profile/orders/${pendingOrderId}`, {
        replace: true,
      });
    } catch (err) {
      console.error("Confirm payment error:", err);
      alert(
        "Thanh toán thất bại: " + (err.response?.data?.message || err.message)
      );
    }
  };

  // ===== HÀNG VOUCHER =====
  const handleSelectVoucher = (voucherObj) => {
    console.log("Voucher được chọn:", voucherObj);
    setVoucher(voucherObj);
  };

  const handleRemoveVoucher = () => {
    setVoucher(null);
  };

  // ===== RENDER LOADING AUTH =====
  if (authLoading) {
    return (
      <div className="checkout-wrapper">
        <div className="checkout-container">
          <p style={{ padding: "20px", textAlign: "center" }}>
            Đang tải thông tin...
          </p>
        </div>
      </div>
    );
  }

  // ===== RENDER CHƯA ĐĂNG NHẬP =====
  if (!isAuthenticated) {
    return (
      <div className="checkout-wrapper">
        <div className="checkout-container">
          <p style={{ padding: "20px", color: "red", textAlign: "center" }}>
            Vui lòng đăng nhập để tiếp tục thanh toán
          </p>
        </div>
      </div>
    );
  }

  // ===== RENDER LOADING CART =====
  if (loading) {
    return (
      <div className="checkout-wrapper">
        <div className="checkout-container">
          <p style={{ padding: "20px", textAlign: "center" }}>
            Đang tải dữ liệu giỏ hàng...
          </p>
        </div>
      </div>
    );
  }

  // ===== RENDER ERROR CART (CHỈ KHI CART ORDER) =====
  if (error && !isDirectOrder) {
    return (
      <div className="checkout-wrapper">
        <div className="checkout-container">
          <p style={{ padding: "20px", color: "red", textAlign: "center" }}>
            Lỗi: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper">
      <div className="checkout-container">
        {/* LEFT SIDE */}
        <div className="checkout-left">
          {/* SHIPPING INFO */}
          <div className="section-box">
            <div className="section-header">
              <span className="section-icon">📍</span>
              <h3 className="section-title">Thông tin giao hàng</h3>
            </div>

            <div className="input-group">
              <label>Họ và tên</label>
              <input
                type="text"
                placeholder="Nhập họ tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Số điện thoại</label>
              <input
                type="text"
                placeholder="Nhập số điện thoại nhận hàng"
                value={phone}
                onChange={handlePhoneChange}
                className={errors.phone ? "input-error" : ""}
              />
              {errors.phone && <p className="error-text">{errors.phone}</p>}
            </div>

            {/* GRID 3 CỘT */}
            <div className="grid-3">
              <div className="input-group">
                <label>Tỉnh / Thành phố</label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                >
                  <option value="">Tỉnh / Thành phố</option>
                  {provinces.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Quận / Huyện</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedProvince}
                >
                  <option value="">Quận / Huyện</option>
                  {districts.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Phường / Xã</label>
                <select
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  disabled={!selectedDistrict}
                >
                  <option value="">Phường / Xã</option>
                  {wards.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Địa chỉ chi tiết</label>
              <input
                type="text"
                placeholder="Nhập chi tiết địa chỉ"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          {/* SHIPPING METHOD */}
          {isAddressComplete && (
            <div className="section-box">
              <div className="section-header">
                <span className="section-icon">🚚</span>
                <h3 className="section-title">Phương thức vận chuyển</h3>
              </div>
              <p className="note">Đơn hàng được miễn phí vận chuyển</p>

              <div className="shipping-options">
                <label className="shipping-option">
                  <input
                    type="radio"
                    name="shipping"
                    value="2-3days"
                    checked={shippingMethod === "2-3days"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  />
                  <div className="shipping-content">
                    <div className="shipping-title">Tiêu chuẩn 2-5 ngày</div>
                    <div className="shipping-desc">
                      Thứ giờ giao hàng tùy thuộc vào điều kiện của địa điểm và
                      vị trí giao hàng. Dự kiến giao hàng 2-5 ngày
                    </div>
                    <div className="shipping-logos">
                      <span className="logo-brand">Shopee Logistics</span>
                      <span className="logo-brand">Ahamove</span>
                      <span className="logo-brand">LEX</span>
                    </div>
                  </div>
                  <div className="shipping-price">0 đ</div>
                </label>
              </div>
            </div>
          )}

          {/* PAYMENT METHOD */}
          {isAddressComplete && (
            <div className="section-box">
              <div className="section-header">
                <span className="section-icon">💳</span>
                <h3 className="section-title">Phương thức thanh toán</h3>
              </div>

              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="payment-icon">📦</span>
                  <span className="payment-text">
                    Thanh toán khi nhận hàng (COD)
                  </span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="vnpay"
                    checked={paymentMethod === "vnpay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="payment-icon">🏦</span>
                  <div className="payment-text-wrap">
                    <span className="payment-text">
                      Công ty thanh toán VNPAY
                    </span>
                    <span className="payment-sub">
                      Hỗ trợ các hình thức VISA, MC, JCB, eWay, ePay, VNPAY...
                    </span>
                  </div>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="shopeepay"
                    checked={paymentMethod === "shopeepay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="payment-icon">📱</span>
                  <span className="payment-text">Ví điện tử ShopeePay</span>
                </label>
              </div>
            </div>
          )}

          {/* ELECTRONIC INVOICE */}
          {isAddressComplete && (
            <div className="section-box">
              <div className="section-header">
                <span className="section-icon">📄</span>
                <h3 className="section-title">Xuất hóa đơn điện tử</h3>
              </div>
              <p className="note">
                Bạn muốn xuất hóa đơn điện tử?{" "}
                <a
                  href="#"
                  className="invoice-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowInvoiceModal(true);
                  }}
                >
                  Nhập thông tin tại đây
                </a>
              </p>
            </div>
          )}

          {/* PRODUCT LIST */}
          <div className="section-box">
            <div className="section-header">
              <span className="section-icon">🛍️</span>
              <h3 className="section-title">
                Sản phẩm ({productsToRender?.length || 0})
              </h3>
            </div>
            {productsToRender && productsToRender.length > 0 ? (
              productsToRender.map((item) => (
                <div key={item.cartItemID || item.id} className="product-item">
                  <img
                    src={item.productImage || "https://via.placeholder.com/100"}
                    alt={item.productName}
                    className="product-image"
                    style={{ maxWidth: "100px", height: "auto" }}
                  />

                  <div className="product-info">
                    <p className="product-name">
                      {item.product?.productName ||
                        item.productName ||
                        "Sản phẩm"}
                    </p>
                    <p className="sku">
                      {item.product?.sku || item.sku || "N/A"}
                    </p>
                    {(item.product?.color || item.color) && (
                      <p className="color-size">
                        <span className="color-dot">■</span>{" "}
                        {item.product?.color || item.color}
                        {(item.product?.size || item.size) &&
                          ` | ${item.product?.size || item.size}`}
                      </p>
                    )}
                    <p className="quantity">Số lượng: {item.quantity}</p>
                  </div>

                  <div className="product-price">
                    {(item.product?.discountPercent ||
                      item.discountPercent) && (
                      <p className="discount">
                        -{item.product?.discountPercent || item.discountPercent}
                        %
                      </p>
                    )}
                    {item.unitPrice && (
                      <>
                        {(item.product?.discountPercent ||
                          item.discountPercent) && (
                          <p className="old-price">
                            {formatCurrency(item.unitPrice)}
                          </p>
                        )}
                        <p className="new-price">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", color: "#999" }}>
                Giỏ hàng trống
              </p>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="checkout-right">
          {/* VOUCHER DISPLAY */}
          {voucher && (
            <div className="voucher-selected-box">
              <div className="voucher-selected-top">
                <span className="voucher-check-icon">✔</span>
                <span>Voucher áp dụng thành công</span>
              </div>

              <div>
                <span className="voucher-code-pill">{voucher.code}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <small style={{ fontSize: "12px", color: "#333" }}>
                  Giảm {formatCurrency(voucher.discountAmount)}
                </small>
                <button
                  onClick={handleRemoveVoucher}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#999",
                    cursor: "pointer",
                    fontSize: "16px",
                    padding: "0",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* VOUCHER BUTTON */}
          {!voucher && (
            <div className="section-box voucher-section">
              <button
                type="button"
                onClick={() => {
                  console.log("Mở modal voucher");
                  setShowVoucherModal(true);
                }}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #e0e0e0",
                  background: "white",
                  color: "#666",
                  cursor: "pointer",
                  borderRadius: "4px",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                🎁 Chọn mã ưu đãi
              </button>
            </div>
          )}

          {/* ORDER SUMMARY */}
          <div className="section-box">
            <div className="section-header">
              <span className="section-icon">📊</span>
              <h3 className="section-title small-title">Chi tiết đơn hàng</h3>
            </div>
            <div className="summary-row">
              <span>Giá trị đơn hàng</span>
              <span>{formatCurrency(originalPrice)}</span>
            </div>
            {discount > 0 && (
              <div className="summary-row">
                <span>Giảm giá trực tiếp</span>
                <span className="discount">-{formatCurrency(discount)}</span>
              </div>
            )}
            {voucherDiscount > 0 && (
              <div className="summary-row">
                <span>Giảm giá (Voucher)</span>
                <span className="discount">
                  -{formatCurrency(voucherDiscount)}
                </span>
              </div>
            )}
            <div className="summary-row">
              <span>Phí vận chuyển</span>
              <span>{formatCurrency(shippingFee)}</span>
            </div>

            <div className="summary-total">
              <strong>Tổng tiền thanh toán</strong>
              <strong className="total-price">
                {formatCurrency(finalPrice)}
              </strong>
            </div>
            <p className="vat-info">(Đã bao gồm thuế VAT)</p>
            {(discount > 0 || voucherDiscount > 0) && (
              <p className="saving-info">
                Tiết kiệm {formatCurrency(discount + voucherDiscount)}
              </p>
            )}

            <button
              className="btn-checkout"
              disabled={!isAddressComplete || checkoutLoading}
              onClick={handleCheckout}
            >
              {checkoutLoading ? "ĐANG XỬ LÝ..." : "THANH TOÁN"}
            </button>
          </div>
        </div>
      </div>

      {/* VOUCHER MODAL */}
      <VoucherModal
        isOpen={showVoucherModal}
        onClose={() => {
          console.log("Đóng modal");
          setShowVoucherModal(false);
        }}
        onSelectVoucher={handleSelectVoucher}
      />

      {/* QR PAYMENT MODAL */}
      <QrPaymentModal
        isOpen={showQr}
        method={paymentMethodMap[paymentMethod]}
        onClose={() => setShowQr(false)}
        onConfirm={handleConfirmQrPayment}
        orderId={pendingOrderId}
      />

      {/* INVOICE FORM MODAL */}
      <InvoiceFormModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
      />
    </div>
  );
}
