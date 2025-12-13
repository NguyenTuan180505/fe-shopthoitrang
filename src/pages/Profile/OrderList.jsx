import React, { useEffect, useState } from "react";
import axiosClientUser from "../../api/axiosClientUser";
import { ChevronDown, Clock, CheckCircle, AlertCircle, Truck } from "lucide-react";
import "./Orders.css";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosClientUser.get("/orders/my");
        setOrders(res.data ?? []);
      } catch (err) {
        console.error("Lỗi khi load đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedId(expandedId === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("pending") || statusLower.includes("processing"))
      return "status-pending";
    if (statusLower.includes("confirmed"))
      return "status-confirmed";
    if (statusLower.includes("shipped"))
      return "status-confirmed";
    if (statusLower.includes("delivered") || statusLower.includes("completed"))
      return "status-completed";
    if (statusLower.includes("cancelled"))
      return "status-cancelled";
    return "status-default";
  };

  const getStatusText = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("pending")) return "Chờ xử lý";
    if (statusLower.includes("processing")) return "Đang xử lý";
    if (statusLower.includes("confirmed")) return "Đã xác nhận";
    if (statusLower.includes("shipped")) return "Đang vận chuyển";
    if (statusLower.includes("delivered")) return "Đã giao";
    if (statusLower.includes("completed")) return "Hoàn thành";
    if (statusLower.includes("cancelled")) return "Đã hủy";
    return status;
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("pending") || statusLower.includes("processing"))
      return <Clock className="status-icon" />;
    if (statusLower.includes("shipped"))
      return <Truck className="status-icon" />;
    if (statusLower.includes("delivered") || statusLower.includes("completed"))
      return <CheckCircle className="status-icon" />;
    if (statusLower.includes("cancelled"))
      return <AlertCircle className="status-icon" />;
    return <Clock className="status-icon" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.orderStatus?.toLowerCase().includes(filter.toLowerCase());
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="orders-wrapper">
      <div className="orders-header">
        <h1 className="orders-title">Đơn Hàng Của Bạn</h1>
        <p className="orders-subtitle">Quản lý và theo dõi các đơn hàng của bạn</p>
      </div>

      {orders.length > 0 && (
        <div className="filter-tabs">
          {["all", "pending", "confirmed", "shipped", "completed", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`filter-btn ${filter === status ? "active" : ""}`}
              >
                {status === "all"
                  ? "Tất cả"
                  : status === "pending"
                  ? "Chờ xử lý"
                  : status === "confirmed"
                  ? "Đã xác nhận"
                  : status === "shipped"
                  ? "Đang vận chuyển"
                  : status === "completed"
                  ? "Hoàn thành"
                  : "Đã hủy"}
              </button>
            )
          )}
        </div>
      )}

      <div className="orders-container">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.orderID}
              className="order-card"
            >
              <div
                className="order-header-main"
                onClick={() => toggleExpand(order.orderID)}
              >
                <div className="order-column">
                  <span className="label">Mã đơn</span>
                  <h3 className="order-id">#{order.orderID}</h3>
                  <p className="order-date">{formatDate(order.orderDate)}</p>
                </div>

                <div className="order-column">
                  <span className="label">Địa chỉ</span>
                  <p className="address-text">{order.shippingAddress}</p>
                </div>

                <div className="order-column">
                  <span className="label">Trạng thái</span>
                  <div className={`order-status ${getStatusColor(order.orderStatus)}`}>
                    {getStatusIcon(order.orderStatus)}
                    <span>{getStatusText(order.orderStatus)}</span>
                  </div>
                </div>

                <div className="order-column">
                  <span className="label">Tổng tiền</span>
                  <p className="price">{order.totalAmount?.toLocaleString("vi-VN")}đ</p>
                </div>

                <ChevronDown
                  className={`chevron ${expandedId === order.orderID ? "rotate" : ""}`}
                />
              </div>

              {expandedId === order.orderID && (
                <div className="order-details">
                  <div className="details-grid">
                    <div className="detail-item">
                      <label>Phương thức thanh toán</label>
                      <p>{order.paymentMethod}</p>
                    </div>
                    <div className="detail-item">
                      <label>Trạng thái thanh toán</label>
                      <p>
                        <span
                          className={`payment-badge ${
                            order.paymentStatus?.toLowerCase() === "paid"
                              ? "paid"
                              : "pending"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="items-section">
                    <h4 className="items-title">Sản phẩm đặt hàng</h4>
                    <div className="items-table">
                      <div className="items-header">
                        <span className="col-name">Tên sản phẩm</span>
                        <span className="col-qty">Số lượng</span>
                        <span className="col-price">Giá tiền</span>
                      </div>
                      {order.orderItems?.map((item) => (
                        <div key={item.productID} className="items-row">
                          <span className="col-name">{item.productName}</span>
                          <span className="col-qty">x{item.quantity}</span>
                          <span className="col-price">
                            {item.subTotal?.toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Tổng cộng:</span>
                      <strong>{order.totalAmount?.toLocaleString("vi-VN")}đ</strong>
                    </div>
                  </div>

                  <div className="order-actions">
                    <button className="action-btn btn-cancel" disabled={order.orderStatus?.toLowerCase().includes("processing") || order.orderStatus?.toLowerCase().includes("pending") || order.orderStatus?.toLowerCase().includes("confirmed") || order.orderStatus?.toLowerCase().includes("shipped")}>
                      Hủy đơn hàng
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Clock className="empty-icon" />
            <h3>Không có đơn hàng</h3>
            <p>
              {filter !== "all"
                ? `Bạn không có đơn hàng nào ở trạng thái này`
                : "Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}