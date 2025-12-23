import React, { useState } from "react";
import "./InvoiceForm.css";

export default function InvoiceFormModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    maSoThue: "",
    tenCongTy: "",
    diaChi: "",
    hoTenNguoiMua: "",
    emailNhanHoaDon: ""
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="popup-header">
          <h2>YÊU CẦU HÓA ĐƠN ĐIỆN TỬ</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* BODY */}
        <div className="popup-body">

          {/* LEFT FORM */}
          <div className="form-left">

            <div className="field">
              <label>Mã số thuế <span className="info">i</span></label>
              <input
                type="text"
                name="maSoThue"
                placeholder="Nhập mã số thuế"
                value={formData.maSoThue}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Tên công ty/ đơn vị</label>
              <input
                type="text"
                name="tenCongTy"
                placeholder="Nhập tên công ty"
                value={formData.tenCongTy}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Địa chỉ công ty/ đơn vị</label>
              <input
                type="text"
                name="diaChi"
                placeholder="Nhập địa chỉ công ty/ đơn vị"
                value={formData.diaChi}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Họ tên người mua hàng</label>
              <input
                type="text"
                name="hoTenNguoiMua"
                placeholder="Nhập họ và tên"
                value={formData.hoTenNguoiMua}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Email nhận hóa đơn điện tử <span className="info">i</span></label>
              <input
                type="email"
                name="emailNhanHoaDon"
                placeholder="Nhập địa chỉ email nhận hóa đơn điện tử"
                value={formData.emailNhanHoaDon}
                onChange={handleChange}
              />
            </div>

            <button className="submit-btn">XÁC NHẬN</button>
          </div>

          {/* RIGHT NOTE */}
          <div className="note-box">
            <h3>Miễn trừ trách nhiệm:</h3>
            <ul>
              <li>Hóa đơn điện tử cho đơn hàng này được tính trên giá trị sản phẩm sau khi giảm trừ các CTKM (nếu có)</li>
              <li>Trường hợp người mua không cung cấp thông tin hoặc không gửi yêu cầu xuất hóa đơn khi đặt hàng, Chúng tôi sẽ sử dụng thông tin trên đơn hàng này để xuất hóa đơn.</li>
              <li>Khuyến nghị: Đối với hóa đơn mua hàng hóa, dịch vụ từng lần có giá trị từ 20 triệu đồng trở lên hoặc tổng các hóa đơn trong cùng 1 ngày có giá trị từ 20 triệu đồng trở lên, quý khách lưu ý và cân nhắc chọn hình thức thanh toán để hóa đơn được hợp lệ. </li>
              <li>Lưu ý nếu Mã số thuế được nhập không chính xác, hóa đơn xuất sẽ không có mã số thuế người mua để đảm bảo tính pháp lý của hóa đơn.</li>
              <li>Trường hợp hóa đơn điện tử có sai sót về tên, địa chỉ của người mua nhưng không sai mã số thuế và các nội dung khác, khách hàng vui lòng liên hệ hotline 18006061.</li>
              <li>Chúng tôi chỉ hỗ trợ xuất hóa đơn một lần duy nhất và Người mua không thể thay đổi thông tin sau bước “Thanh toán” đơn hàng.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
