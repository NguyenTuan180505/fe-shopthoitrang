import React from "react";
import { useNavigate } from "react-router-dom";
import "./qrModal.css";


export default function QrPaymentModal({ isOpen, onConfirm, onClose, method, orderId }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleConfirmPayment = async () => {
    await onConfirm(); // Gọi hàm thanh toán từ parent
    
    // Chờ 300ms để modal đóng, rồi điều hướng
    setTimeout(() => {
      if (orderId) {
        navigate(`/profile/orders/${orderId}`);
      }
    }, 300);
  };

  return (
    <div className="qr-overlay">
      <div className="qr-modal">
        <h3>Thanh toán {method}</h3>

        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DEMO_PAYMENT"
          alt="QR Demo"
        />

        <p style={{ marginTop: 10 }}>
          Quét mã QR để thanh toán (demo)
        </p>

        <div className="qr-actions">
          <button onClick={onClose}>Hủy</button>
          <button className="btn-confirm" onClick={handleConfirmPayment}>
            Tôi đã thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}