import React, { useState, useMemo } from "react";
import "./voucherModal.css";

const VoucherModal = ({ isOpen, onClose, onSelectVoucher, cartData }) => {
  const [voucherSearch, setVoucherSearch] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  // =========================
  // DEMO VOUCHERS
  // =========================
  const demoVouchers = [
    {
      id: "demo_1",
      code: "BLACK100",
      name: "Voucher 100K",
      desc: "VC 100k cho đơn từ 899k",
      discountAmount: 100000,
      tag: "DEMO - Lựa chọn tốt",
      expiry: "Sắp hết hạn: Còn 3 ngày",
      minOrderAmount: 899000,
      isDemo: true,
    },
    {
      id: "demo_2",
      code: "GIAM50",
      name: "Voucher 50K",
      desc: "Giảm 50k cho đơn từ 999k",
      discountAmount: 50000,
      tag: null,
      expiry: "Sắp hết hạn: Còn 2 ngày",
      minOrderAmount: 999000,
      isDemo: true,
    },
    {
      id: "demo_3",
      code: "BANMOI80",
      name: "Voucher 80K",
      desc: "Giảm 80k cho đơn Online từ 399k",
      discountAmount: 80000,
      tag: null,
      expiry: "HSD: 2025-12-31",
      minOrderAmount: 399000,
      isDemo: true,
    },
  ];

  // =========================
  // 🔥 VOUCHER CART (CỐ TÌNH GIỐNG DEMO)
  // =========================
  const cartVoucher = useMemo(() => {
  // ❗❗❗ GÁN CỨNG – KHÔNG PHỤ THUỘC DỮ LIỆU
  const discountAmount = 20;

  return {
    id: "cart_discount",
    code: "CART_DISCOUNT",
    name: "Giảm giá từ sản phẩm",
    desc: `Giảm ${discountAmount}đ từ sản phẩm trong giỏ`,
    discountAmount,        // = 20
    tag: "ÁP DỤNG TỰ ĐỘNG",
    expiry: "Áp dụng hôm nay",
    minOrderAmount: 0,

    // giữ giống demo để Payment không trừ tiền
    isDemo: true,
    isFromCart: true,
  };
}, 
 [cartData]);

  // =========================
  // DANH SÁCH VOUCHER
  // =========================
  const voucherList = useMemo(() => {
    if (!isOpen) return [];
    return [cartVoucher, ...demoVouchers];
  }, [isOpen, cartVoucher]);

  // =========================
  // CHỌN VOUCHER
  // =========================
  const handleSelectVoucher = (voucher) => {
    setSelectedVoucher(voucher);

    onSelectVoucher({
      voucherId: voucher.id,
      code: voucher.code,
      discountAmount: voucher.discountAmount,
      name: voucher.name,
      isDemo: voucher.isDemo,       // 🔥 QUAN TRỌNG
      isFromCart: voucher.isFromCart,
    });

    setVoucherSearch("");
    onClose();
  };

  if (!isOpen) return null;

  // =========================
  // UI (GIỮ NGUYÊN)
  // =========================
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>MÃ ƯU ĐÃI</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="voucher-search">
            <input
              type="text"
              placeholder="Nhập mã ưu đãi"
              value={voucherSearch}
              onChange={(e) => setVoucherSearch(e.target.value)}
              className="voucher-search-input"
            />
            <button className="voucher-search-btn">ÁP DỤNG</button>
          </div>

          <div className="voucher-list">
            {voucherList.map((voucher) => (
              <label key={voucher.id} className="voucher-card">
                <input
                  type="radio"
                  checked={selectedVoucher?.id === voucher.id}
                  onChange={() => setSelectedVoucher(voucher)}
                  className="voucher-radio"
                />
                <div className="voucher-card-content">
                  {voucher.tag && (
                    <span className="voucher-tag">{voucher.tag}</span>
                  )}
                  <div className="voucher-card-name">{voucher.name}</div>
                  <div className="voucher-card-code">Mã: {voucher.code}</div>
                  <div className="voucher-card-desc">{voucher.desc}</div>
                  <div className="voucher-card-expiry">{voucher.expiry}</div>
                </div>
                <button
                  type="button"
                  className="voucher-select-btn"
                  onClick={() => handleSelectVoucher(voucher)}
                >
                  Áp dụng
                </button>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherModal;
