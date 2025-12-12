import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Plus, X } from "lucide-react";
import "./Address.css";

/* ===============================
   ADD / EDIT ADDRESS MODAL
=============================== */
function AddAddressModal({ isOpen, onClose, editingAddress, onAdd, onUpdate }) {
  const [formData, setFormData] = useState(
    editingAddress
      ? {
          hoTen: editingAddress.hoTen,
          soDienThoai: editingAddress.soDienThoai,
          tinh: editingAddress.tinh,
          quan: editingAddress.quan,
          phuong: editingAddress.phuong,
          diaChi: editingAddress.diaChi,
        }
      : {
          hoTen: "",
          soDienThoai: "",
          tinh: "",
          quan: "",
          phuong: "",
          diaChi: "",
        }
  );

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.hoTen || !formData.soDienThoai || !formData.diaChi) return;

    if (editingAddress) {
      onUpdate(formData);
    } else {
      onAdd({
        id: Date.now(),
        name: formData.hoTen,
        phone: formData.soDienThoai,
        address: `${formData.diaChi}, ${formData.phuong}, ${formData.quan}, ${formData.tinh}`,
        hoTen: formData.hoTen,
        soDienThoai: formData.soDienThoai,
        tinh: formData.tinh,
        quan: formData.quan,
        phuong: formData.phuong,
        diaChi: formData.diaChi,
        isDefault: false,
        status: "Địa chỉ phụ",
      });
    }

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="add-address-modal">
        <div className="modal-header">
          <h2>{editingAddress ? "CHỈNH SỬA ĐỊA CHỈ" : "THÊM ĐỊA CHỈ MỚI"}</h2>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-row-2col">
            <div className="form-group">
              <label>Họ tên</label>
              <input name="hoTen" value={formData.hoTen} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                name="soDienThoai"
                value={formData.soDienThoai}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row-3col">
            <div className="form-group">
              <label>Tỉnh / Thành phố</label>
              <select name="tinh" value={formData.tinh} onChange={handleChange}>
                <option value="">Chọn</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Cần Thơ">Cần Thơ</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quận / Huyện</label>
              <select name="quan" value={formData.quan} onChange={handleChange}>
                <option value="">Chọn</option>
                <option value="Huyện Hòa Vang">Huyện Hòa Vang</option>
                <option value="Quận 1">Quận 1</option>
              </select>
            </div>

            <div className="form-group">
              <label>Phường / Xã</label>
              <select name="phuong" value={formData.phuong} onChange={handleChange}>
                <option value="">Chọn</option>
                <option value="Xã Hòa Liên">Xã Hòa Liên</option>
                <option value="Phường 1">Phường 1</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Địa chỉ chi tiết</label>
            <input
              name="diaChi"
              value={formData.diaChi}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-submit-modal" onClick={handleSubmit}>
            {editingAddress ? "CẬP NHẬT" : "LƯU THÔNG TIN"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===============================
   ADDRESS CARD COMPONENT
=============================== */
function AddressCard({ addr, onEdit, onDelete, onSetDefault }) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // ✅ Đóng menu khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpenMenu(false);
      }
    }

    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [openMenu]);

  const handleEdit = () => {
    onEdit(addr);
    setOpenMenu(false);
  };

  const handleDelete = () => {
    onDelete(addr.id);
    setOpenMenu(false);
  };

  const handleSetDefault = () => {
    onSetDefault(addr.id);
    setOpenMenu(false);
  };

  return (
    <div className="address-card">
      <div className="address-header">
        <h3>{addr.name}</h3>

        <button
          ref={buttonRef}
          className="btn-more"
          onClick={() => setOpenMenu(!openMenu)}
          title="Tùy chọn"
        >
          <MoreVertical size={20} />
        </button>

        {openMenu && (
          <div ref={menuRef} className="address-menu">
            <button onClick={handleEdit}>✏️ Chỉnh sửa</button>

            {!addr.isDefault && (
              <button onClick={handleSetDefault}>📍 Đặt làm mặc định</button>
            )}

            {!addr.isDefault && (
              <button className="delete" onClick={handleDelete}>
                🗑️ Xóa
              </button>
            )}
          </div>
        )}
      </div>

      <p className="address-phone">{addr.phone}</p>
      <p className="address-text">{addr.address}</p>

      {addr.isDefault && (
        <span className="address-status">📍 {addr.status}</span>
      )}
    </div>
  );
}

/* ===============================
   ADDRESS LIST COMPONENT
=============================== */
export default function Address() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Lê Duy Quốc",
      phone: "0358455416",
      address: "20 châu thị vĩnh té, Xã Hòa Liên, Huyện Hòa Vang, Đà Nẵng",
      hoTen: "Lê Duy Quốc",
      soDienThoai: "0358455416",
      tinh: "Đà Nẵng",
      quan: "Huyện Hòa Vang",
      phuong: "Xã Hòa Liên",
      diaChi: "20 châu thị vĩnh té",
      isDefault: true,
      status: "Địa chỉ mặc định",
    },
  ]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const addAddress = (addr) => {
    setAddresses((prev) => [...prev, addr]);
  };

  const updateAddress = (updated) => {
    setAddresses((prev) =>
      prev.map((a) =>
        a.id === editingAddress.id
          ? {
              ...a,
              ...updated,
              name: updated.hoTen,
              phone: updated.soDienThoai,
              address: `${updated.diaChi}, ${updated.phuong}, ${updated.quan}, ${updated.tinh}`,
            }
          : a
      )
    );
    setEditingAddress(null);
  };

  const deleteAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const setDefault = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
        status: a.id === id ? "Địa chỉ mặc định" : "Địa chỉ phụ",
      }))
    );
  };

  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingAddress(null);
  };

  return (
    <>
      <div className="content-section">
        <h1 className="section-title">SỔ ĐỊA CHỈ</h1>

        <button className="btn-add-address" onClick={handleOpenAddModal}>
          <Plus size={20} /> THÊM ĐỊA CHỈ
        </button>

        <div className="addresses-grid">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              addr={addr}
              onEdit={(address) => {
                setEditingAddress(address);
                setModalOpen(true);
              }}
              onDelete={deleteAddress}
              onSetDefault={setDefault}
            />
          ))}
        </div>
      </div>

      <AddAddressModal
        key={editingAddress ? editingAddress.id : "new"}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingAddress={editingAddress}
        onAdd={addAddress}
        onUpdate={updateAddress}
      />
    </>
  );
}