// src/components/OrderDetailModal.jsx
import { format } from 'date-fns';

export default function OrderDetailModal({
  order,
  isOpen,
  onClose,
  users = [],
  payments = []
}) {

  if (!isOpen || !order) return null;

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  };
  const getUserName = (userID) => {
    const user = users.find(u => u.userID === userID);
    return user ? user.fullName : `User #${userID}`;
  };
  const getPaymentInfo = () => {
    if (!['VNPAY', 'SHOPEEPAY'].includes(order.paymentMethod)) {
      return {
        text: order.paymentStatus === 'Paid' ? 'Đã thanh toán' : 'Chưa thanh toán',
        class:
          order.paymentStatus === 'Paid'
            ? 'bg-success'
            : 'bg-warning text-dark'
      };
    }

    const payment = payments.find(
      p =>
        p.orderID === order.orderID &&
        p.paymentMethod === order.paymentMethod
    );

    if (!payment) {
      return { text: 'Chưa xác nhận', class: 'bg-secondary' };
    }

    if (payment.status === 'Success') {
      return { text: 'Đã thanh toán', class: 'bg-success' };
    }

    return { text: 'Thanh toán thất bại', class: 'bg-danger' };
  };

  const getStatusInfo = (status) => {
    const map = {
      Processing: { text: 'Đang xử lý', class: 'bg-warning text-dark' },
      Confirmed: { text: 'Đã xác nhận', class: 'bg-primary' },
      Shipping: { text: 'Đang giao', class: 'bg-info text-white' },
      Delivered: { text: 'Đã giao', class: 'bg-success' },
      Cancelled: { text: 'Đã hủy', class: 'bg-danger' },
    };
    return map[status] || { text: status, class: 'bg-secondary' };
  };

  const status = getStatusInfo(order.orderStatus);

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1040 }}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content shadow-lg border-0">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title fw-bold">
                Chi tiết đơn hàng #{order.orderID}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                aria-label="Close"
              />
            </div>

            <div className="modal-body py-4">
              {/* Thông tin chính */}
              <div className="row g-3 mb-4">
                <div className="col-6">
                  <strong>Ngày đặt hàng:</strong><br />
                  <span className="text-primary fs-5">{formatDate(order.orderDate)}</span>
                </div>
                <div className="col-6 text-end">
                  <strong>Trạng thái đơn hàng:</strong><br />
                  <span className={`badge fs-6 px-3 py-2 ${status.class}`}>
                    {status.text}
                  </span>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <strong>Khách hàng:</strong><br />
                  <span className="fw-bold text-primary">
                    {getUserName(order.userID)}
                  </span>
                </div>
                <div className="col-6">
                  <strong>Địa chỉ giao hàng:</strong><br />
                  <span className="text-muted">
                    {order.shippingAddress || 'Chưa cung cấp địa chỉ'}
                  </span>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <strong>Phương thức thanh toán:</strong><br />
                  <span className="badge bg-dark">{order.paymentMethod || 'COD'}</span>
                </div>
                <div className="col-6 text-end">
                  <strong>Trạng thái thanh toán:</strong><br />
                  {(() => {
                    const payment = getPaymentInfo();
                    return (
                      <span className={`badge fs-6 px-3 py-2 ${payment.class}`}>
                        {payment.text}
                      </span>
                    );
                  })()}

                </div>
              </div>

              <hr className="my-4" />

              {/* Danh sách sản phẩm */}
              <h5 className="mb-3 fw-bold text-primary">Sản phẩm trong đơn</h5>
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th width="50" className="text-center">#</th>
                      <th>Sản phẩm</th>
                      <th width="100" className="text-center">Số lượng</th>
                      <th width="140" className="text-end">Đơn giá</th>
                      <th width="140" className="text-end">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td className="fw-500">
                          {item.productName || 'Sản phẩm đã xóa'}
                        </td>
                        <td className="text-center fw-bold">{item.quantity}</td>
                        <td className="text-end">
                          {Number(item.unitPrice).toLocaleString('vi-VN')}đ
                        </td>
                        <td className="text-end text-danger fw-bold">
                          {Number(item.subTotal).toLocaleString('vi-VN')}đ
                        </td>
                      </tr>
                    ))}
                    <tr className="table-primary fw-bold">
                      <td colSpan="4" className="text-end fs-5">TỔNG CỘNG</td>
                      <td className="text-end text-danger fs-4 fw-bold">
                        {Number(order.totalAmount).toLocaleString('vi-VN')}đ
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary px-4"
                onClick={onClose}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}