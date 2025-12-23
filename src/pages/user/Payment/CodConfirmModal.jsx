import "../Payment/CodConfirmModal.css"
export default function CodConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>📦 Xác nhận thanh toán COD</h3>

        <p>
          Bạn đã chọn <b>Thanh toán khi nhận hàng (COD)</b>.
          <br />
          Vui lòng chuẩn bị đủ số tiền khi shipper giao hàng.
        </p>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Xác nhận đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
}
