import { useState, useEffect, useMemo } from 'react';
import axiosClient from '../../../api/axiosClient';
import OrderDetailModal from './OrderDetailModal';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  // Format ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  // Format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
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

  // --- TÍNH TOÁN THỐNG KÊ ---
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const pendingOrders = orders.filter(o => o.orderStatus === 'Processing' || o.orderStatus === 'Pending').length;
    return { totalOrders, totalRevenue, pendingOrders };
  }, [orders]);

  // --- LỌC ĐƠN HÀNG ---
  const filteredOrders = useMemo(() => {
    return orders.filter(order => 
       order.orderID.toString().includes(searchTerm) || 
       order.userID.toString().includes(searchTerm)
    );
  }, [orders, searchTerm]);

  // Hàm lấy màu Badge
  const getStatusBadge = (status) => {
      switch(status) {
          case 'Delivered': return 'bg-success';
          case 'Cancelled': return 'bg-danger';
          case 'Processing': return 'bg-primary';
          case 'Shipping': return 'bg-info text-dark';
          default: return 'bg-warning text-dark';
      }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
      <div className="spinner-border text-primary"></div>
    </div>
  );

  return (
    <div className="container-fluid p-4 bg-light" style={{ minHeight: '100vh' }}>
      
      {/* 1. HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 className="fw-bold text-primary mb-1">
                <i className="bi bi-receipt-cutoff me-2"></i>QUẢN LÝ ĐƠN HÀNG
            </h3>
            <p className="text-muted mb-0">Theo dõi trạng thái và xử lý đơn đặt hàng</p>
        </div>
        <button className="btn btn-outline-primary shadow-sm" onClick={fetchOrders}>
            <i className="bi bi-arrow-clockwise me-2"></i> Làm mới
        </button>
      </div>

      {/* 2. TOOLBAR GỘP THỐNG KÊ (NEW DESIGN) */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body py-3">
            <div className="row g-3 align-items-center justify-content-between">
                
                {/* TRÁI: Tìm kiếm */}
                <div className="col-md-5">
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0 text-muted"><i className="bi bi-search"></i></span>
                        <input 
                            type="text" 
                            className="form-control border-start-0 ps-0" 
                            placeholder="Nhập mã đơn, ID khách hàng..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* PHẢI: Thống kê rút gọn & Highlight Chờ xử lý */}
                <div className="col-md-7 d-flex justify-content-end align-items-center gap-4">
                    
                    {/* Rút gọn: Doanh thu */}
                    <div className="text-end d-none d-lg-block border-end pe-4">
                        <small className="text-muted d-block text-uppercase" style={{fontSize: '0.7rem'}}>Tổng Doanh Thu</small>
                        <span className="fw-bold text-success">{formatCurrency(stats.totalRevenue)}</span>
                    </div>

                    {/* Rút gọn: Tổng đơn */}
                    <div className="text-end d-none d-lg-block border-end pe-4">
                        <small className="text-muted d-block text-uppercase" style={{fontSize: '0.7rem'}}>Tổng Đơn</small>
                        <span className="fw-bold text-dark">{stats.totalOrders}</span>
                    </div>

                    {/* Highlight: CHỜ XỬ LÝ (Quan trọng nhất) */}
                    <div className="d-flex align-items-center bg-warning bg-opacity-10 px-4 py-2 rounded-3 border border-warning border-opacity-25">
                        <div className="me-3 text-warning">
                            <i className="bi bi-hourglass-split fs-3"></i>
                        </div>
                        <div>
                            <div className="fw-bold fs-4 lh-1 text-warning">{stats.pendingOrders}</div>
                            <small className="text-warning text-uppercase fw-bold" style={{fontSize: '0.65rem'}}>Chờ xử lý</small>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>

      {/* 3. TABLE DATA */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4 py-3 text-secondary small text-uppercase fw-bold">Mã Đơn</th>
                      <th className="py-3 text-secondary small text-uppercase fw-bold">Ngày Đặt</th>
                      <th className="py-3 text-secondary small text-uppercase fw-bold">Khách Hàng</th>
                      <th className="py-3 text-secondary small text-uppercase fw-bold">Tổng Tiền</th>
                      <th className="py-3 text-secondary small text-uppercase fw-bold">Thanh Toán</th>
                      <th className="py-3 text-secondary small text-uppercase fw-bold">Trạng Thái</th>
                      <th className="py-3 text-secondary small text-uppercase fw-bold text-center">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map(order => (
                          <tr key={order.orderID} style={{borderBottom: '1px solid #f0f0f0'}}>
                            <td className="ps-4 fw-bold text-primary">#{order.orderID}</td>
                            <td>
                                <div className="text-muted small">
                                    {formatDate(order.orderDate)}
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <div className="bg-light rounded-circle d-flex justify-content-center align-items-center me-2 text-secondary border" style={{width: '30px', height: '30px'}}>
                                        <i className="bi bi-person-fill small"></i>
                                    </div>
                                    <span className="fw-semibold small">User #{order.userID}</span>
                                </div>
                            </td>
                            <td>
                                <span className="fw-bold text-dark">{formatCurrency(order.totalAmount)}</span>
                            </td>
                            <td>
                                <span className={`badge border ${order.paymentStatus === 'Paid' ? 'bg-success bg-opacity-10 text-success border-success' : 'bg-warning bg-opacity-10 text-warning border-warning'}`}>
                                    {order.paymentStatus === 'Pending' ? 'Chưa TT' : 'Đã TT'}
                                </span>
                                <div className="small text-muted mt-1" style={{fontSize: '0.75rem'}}>{order.paymentMethod}</div>
                            </td>
                            <td>
                                <select
                                    value={order.orderStatus}
                                    onChange={(e) => updateOrderStatus(order.orderID, e.target.value)}
                                    className={`form-select form-select-sm fw-bold border-0 ${getStatusBadge(order.orderStatus)} text-white`}
                                    style={{width: '130px', cursor: 'pointer', fontSize: '0.85rem'}}
                                >
                                    <option className="bg-white text-dark" value="Processing">⏳ Đang xử lý</option>
                                    <option className="bg-white text-dark" value="Confirmed">✅ Đã xác nhận</option>
                                    <option className="bg-white text-dark" value="Shipping">🚚 Đang giao</option>
                                    <option className="bg-white text-dark" value="Delivered">🎁 Đã giao</option>
                                    <option className="bg-white text-dark" value="Cancelled">❌ Đã hủy</option>
                                </select>
                            </td>
                            <td className="text-center">
                                <button
                                    className="btn btn-sm btn-light text-primary border"
                                    onClick={() => {
                                        setSelectedOrder(order);
                                        setIsModalOpen(true);
                                    }}
                                    title="Xem chi tiết"
                                >
                                    <i className="bi bi-eye-fill"></i>
                                </button>
                            </td>
                          </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center py-5 text-muted">
                                <i className="bi bi-inbox fs-1 d-block mb-2 opacity-50"></i>
                                Không tìm thấy đơn hàng nào.
                            </td>
                        </tr>
                    )}
                  </tbody>
                </table>
            </div>
        </div>
      </div>

      {/* MODAL CHI TIẾT */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}