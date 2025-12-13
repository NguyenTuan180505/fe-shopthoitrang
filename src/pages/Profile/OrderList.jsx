import React, { useEffect, useState } from "react";
import axiosClientUser from "../../api/axiosClientUser";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  ChevronRight,
} from "lucide-react";
import "./Orders.css";
import { useNavigate, useParams, Outlet } from "react-router-dom";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const { id } = useParams();

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

  /* ===================== STATUS HELPERS ===================== */

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("pending") || s.includes("processing"))
      return "status-pending";
    if (s.includes("confirmed") || s.includes("shipped"))
      return "status-confirmed";
    if (s.includes("completed") || s.includes("delivered"))
      return "status-completed";
    if (s.includes("cancelled")) return "status-cancelled";
    return "status-default";
  };

  const getStatusText = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("pending")) return "Chờ xử lý";
    if (s.includes("processing")) return "Đang xử lý";
    if (s.includes("confirmed")) return "Đã xác nhận";
    if (s.includes("shipped")) return "Đang vận chuyển";
    if (s.includes("completed") || s.includes("delivered"))
      return "Hoàn thành";
    if (s.includes("cancelled")) return "Đã hủy";
    return status;
  };

  const getStatusIcon = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("shipped")) return <Truck className="status-icon" />;
    if (s.includes("completed") || s.includes("delivered"))
      return <CheckCircle className="status-icon" />;
    if (s.includes("cancelled"))
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

  /* ===================== FILTER ===================== */

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.orderStatus
      ?.toLowerCase()
      .includes(filter.toLowerCase());
  });

  /* ===================== RENDER ===================== */

  if (id) {
    return <Outlet />;
  }

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
        <p className="orders-subtitle">
          Quản lý và theo dõi các đơn hàng của bạn
        </p>
      </div>

      {orders.length > 0 && (
        <div className="filter-tabs">
          {[
            "all",
            "pending",
            "confirmed",
            "shipped",
            "completed",
            "cancelled",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`filter-btn ${
                filter === status ? "active" : ""
              }`}
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
          ))}
        </div>
      )}

      <div className="orders-container">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.orderID}
              className="order-card clickable"
              onClick={() => navigate(`/profile/orders/${order.orderID}`)}
            >
              <div className="order-header-main">
                <div className="order-column">
                  <span className="label">Mã đơn</span>
                  <h3 className="order-id">#{order.orderID}</h3>
                </div>

                <div className="order-column">
                  <span className="label">Ngày đặt hàng</span>
                  <p className="order-date">
                    {formatDate(order.orderDate)}
                  </p>
                </div>

                <div className="order-column">
                  <span className="label">Tổng tiền</span>
                  <p className="price">
                    {order.totalAmount?.toLocaleString(
                      "vi-VN"
                    )}
                    đ
                  </p>
                </div>

                <div className="order-column">
                  <span className="label">Trạng thái</span>
                  <div
                    className={`order-status ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {getStatusIcon(order.orderStatus)}
                    <span>
                      {getStatusText(order.orderStatus)}
                    </span>
                  </div>
                </div>

                <ChevronRight className="chevron-right" />
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Clock className="empty-icon" />
            <h3>Không có đơn hàng</h3>
            <p>
              {filter !== "all"
                ? "Bạn không có đơn hàng nào ở trạng thái này"
                : "Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}