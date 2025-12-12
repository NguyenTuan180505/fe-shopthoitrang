// src/pages/admin/Orders.jsx
import { useState, useEffect } from 'react';
import axiosClient from '../../../api/axiosClient';
import { format } from 'date-fns';
import OrderDetailModal from './OrderDetailModal';   // THÊM DÒNG NÀY

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // THÊM 2 STATE CHO MODAL
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosClient.get('/Orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      alert('Lỗi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axiosClient.put(`/Orders/${orderId}/status`, { orderStatus: newStatus });
      setOrders(prev =>
        prev.map(order =>
          order.orderID === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (err) {
      alert('Cập nhật thất bại');
    }
  };

  if (loading) return <div className="text-center py-5">Đang tải đơn hàng...</div>;

  return (
    <div className="container-fluid">
      <h2 className="mb-4">Quản lý Đơn hàng</h2>

      <div className="table-responsive shadow">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Mã đơn</th>
              <th>Ngày đặt</th>
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Tổng tiền</th>
              <th>Thanh toán</th>
              <th>Trạng thái ĐH</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.orderID}>
                <td><strong>#{order.orderID}</strong></td>
                <td>{formatDate(order.orderDate)}</td>
                <td>User ID: {order.userID}</td>
                <td>
                  <ul className="mb-0 ps-3">
                    {order.orderItems.map((item, idx) => (
                      <li key={idx}>
                        {item.productName || 'Sản phẩm đã xóa'} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="text-danger fw-bold">
                  {order.totalAmount.toLocaleString('vi-VN')}đ
                </td>
                <td>
                  <span className={`badge ${order.paymentStatus === 'Paid' ? 'bg-success' : 'bg-warning'}`}>
                    {order.paymentStatus === 'Pending' ? 'Chưa thanh toán' : 'Đã thanh toán'}
                  </span>
                  <br />
                  <small>{order.paymentMethod}</small>
                </td>
                <td>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateOrderStatus(order.orderID, e.target.value)}
                    className="form-select form-select-sm"
                  >
                    <option value="Processing">Đang xử lý</option>
                    <option value="Confirmed">Đã xác nhận</option>
                    <option value="Shipping">Đang giao</option>
                    <option value="Delivered">Đã giao</option>
                    <option value="Cancelled">Đã hủy</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsModalOpen(true);
                    }}
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-5 text-muted">
          Chưa có đơn hàng nào
        </div>
      )}

      {/* MODAL CHI TIẾT – ĐẶT Ở CUỐI TRƯỚC </div> */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}