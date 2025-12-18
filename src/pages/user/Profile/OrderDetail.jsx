import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClientUser from "../../../api/axiosClientUser";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  ArrowLeft,
} from "lucide-react";
import "./OrderDetail.css";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        /* ===================== ORDER ===================== */
        const orderRes = await axiosClientUser.get(`/orders/${id}`);
        setOrder(orderRes.data);

        /* ===================== PAYMENT (ARRAY) ===================== */
        const paymentRes = await axiosClientUser.get(
          `/payments/order/${id}`
        );

        const payments = paymentRes.data;

        if (Array.isArray(payments) && payments.length > 0) {
          // lấy payment mới nhất (paymentID lớn nhất)
          const latestPayment = payments.reduce((latest, current) =>
            current.paymentID > latest.paymentID ? current : latest
          );
          setPayment(latestPayment);
        } else {
          setPayment(null);
        }
      } catch (err) {
        console.error("Lỗi load order detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  /* ===================== CANCEL ===================== */
  const cancelOrder = async () => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;

    try {
      await axiosClientUser.put(`/orders/${id}/cancel`);
      alert("Đã hủy đơn hàng");
      navigate("/profile/orders");
    } catch {
      alert("Không thể hủy đơn hàng");
    }
  };

  /* ===================== BACK ===================== */
  const handleBack = () => {
    navigate("/profile/orders");
  };

  /* ===================== STATUS ===================== */
  const getOrderStatusText = (status) => {
    const s = status?.toLowerCase();
    if (s?.includes("pending")) return "Chờ xử lý";
    if (s?.includes("processing")) return "Đang xử lý";
    if (s?.includes("confirmed")) return "Đã xác nhận";
    if (s?.includes("shipped")) return "Đang vận chuyển";
    if (s?.includes("completed")) return "Hoàn thành";
    if (s?.includes("cancelled")) return "Đã hủy";
    return status;
  };

  const getOrderStatusIcon = (status) => {
    const s = status?.toLowerCase();
    if (s?.includes("shipped")) return <Truck />;
    if (s?.includes("completed")) return <CheckCircle />;
    if (s?.includes("cancelled")) return <AlertCircle />;
    return <Clock />;
  };

  const getPaymentStatusText = (status) => {
    if (!status) return "Chưa thanh toán";
    return status.toLowerCase() === "success"
      ? "Đã thanh toán"
      : "Chưa thanh toán";
  };

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

  if (loading) return <p>Đang tải chi tiết đơn hàng...</p>;
  if (!order) return <p>Không tìm thấy đơn hàng</p>;

  return (
    <div className="order-detail-wrapper">
      <button className="back-btn" onClick={handleBack}>
        <ArrowLeft size={18} /> Quay lại
      </button>

      {/* ===================== ORDER HEADER ===================== */}
      <div className="order-header">
        <div className="header-left">
          <h1>Đơn hàng #{order.orderID}</h1>
          <p className="order-date-small">
            Ngày đặt: {new Date(order.orderDate).toLocaleString("vi-VN")}
          </p>
          <p className="order-address-small">Địa chỉ giao hàng: {order.shippingAddress}</p>
        </div>

        <div
          className={`order-status-badge ${getStatusColor(
            order.orderStatus
          )}`}
        >
          {getOrderStatusIcon(order.orderStatus)}
          <span>{getOrderStatusText(order.orderStatus)}</span>
        </div>
      </div>

      {/* ===================== ITEMS ===================== */}
      <div className="items-box">
        <h3>Sản phẩm</h3>
        {order.orderItems?.map((item) => (
          <div key={item.productID} className="item-card">
            <div className="item-image">
              <img
                src={item.productImage || "/placeholder.jpg"}
                alt={item.productName}
              />
            </div>
            <div className="item-details">
              <p className="item-name">{item.productName}</p>
              <p className="item-price">Giá: {item.unitPrice?.toLocaleString("vi-VN")}đ</p>
              <p className="item-qty">Số lượng: {item.quantity}</p>
              <p className="item-subtotal">
                Thành tiền: {item.subTotal?.toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ===================== ORDER TOTAL ===================== */}
      <div className="order-total">
        <strong>Tổng cộng:</strong>{" "}
        <span>{order.totalAmount?.toLocaleString("vi-VN")}đ</span>
      </div>

      {/* ===================== PAYMENT ===================== */}
      <div className="payment-box">
        <h3>Thanh toán</h3>
        {payment ? (
          <div className="payment-details">
            <p>
              <strong>Phương thức:</strong> {payment.paymentMethod}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <span
                className={
                  payment.status?.toLowerCase() === "success"
                    ? "paid"
                    : "pending"
                }
              >
                {getPaymentStatusText(payment.status)}
              </span>
            </p>
            <p>
              <strong>Mã giao dịch:</strong> {payment.transactionID}
            </p>
            <p>
              <strong>Ngày thanh toán:</strong>{" "}
              {new Date(payment.paymentDate).toLocaleString("vi-VN")}
            </p>
          </div>
        ) : (
          <p>Chưa có thanh toán</p>
        )}
      </div>

      {/* ===================== ACTION ===================== */}
      {!order.orderStatus?.toLowerCase().includes("cancelled") && (
        <button className="cancel-btn" onClick={cancelOrder}>
          Hủy đơn hàng
        </button>
      )}
    </div>
  );
}