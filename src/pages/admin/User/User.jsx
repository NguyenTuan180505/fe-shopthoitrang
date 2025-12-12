// src/pages/admin/Users.jsx
import { useState, useEffect } from 'react';
import axiosClient from '../../../api/axiosClient';
import { format } from 'date-fns';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal đổi vai trò
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosClient.get('/Users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert('Lỗi tải danh sách tài khoản');
    } finally {
      setLoading(false);
    }
  };

  // Bật / tắt tài khoản
  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      await axiosClient.put(`/Users/${userId}/status`, { isActive: newStatus });
      setUsers(prev =>
        prev.map(user =>
          user.userID === userId ? { ...user, isActive: newStatus } : user
        )
      );
    } catch (err) {
      console.error(err);
      alert('Cập nhật trạng thái thất bại');
    }
  };

  // Mở modal đổi vai trò
  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role?.roleName || "USER");
    setShowRoleModal(true);
  };

  // Gửi API PUT đổi vai trò
  const updateUserRole = async () => {
    if (!selectedUser) return;

    try {
      await axiosClient.put(`/Users/${selectedUser.userID}/role`, {
        roleName: newRole
      });

      // Cập nhật UI sau khi đổi
      setUsers(prev =>
        prev.map(u =>
          u.userID === selectedUser.userID
            ? { ...u, role: { ...u.role, roleName: newRole } }
            : u
        )
      );

      setShowRoleModal(false);
    } catch (err) {
      console.error(err);
      alert("Cập nhật vai trò thất bại");
    }
  };

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm');
  };

  if (loading) return <div className="text-center py-5">Đang tải tài khoản...</div>;

  return (
    <div className="container-fluid">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Quản lý Tài khoản</h2>
        {/* <button className="btn btn-success">
          <i className="bi bi-plus-lg me-2"></i>Thêm tài khoản
        </button> */}
      </div>

      {/* TABLE */}
      {users.length === 0 ? (
        <div className="text-center py-5 text-muted">Chưa có tài khoản nào</div>
      ) : (
        <div className="table-responsive shadow rounded">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th width="80">ID</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
                <th width="120">Trạng thái</th>
                <th width="140">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {users.map(user => (
                <tr key={user.userID}>
                  <td><strong>#{user.userID}</strong></td>

                  {/* Avatar + Name */}
                  <td>
                    <div className="d-flex align-items-center">
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: 40, height: 40, fontSize: '1.1rem' }}
                      >
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="fw-bold">{user.fullName}</div>
                        {user.role?.roleName === 'ADMIN' && (
                          <small className="text-danger fw-500">Quản trị viên</small>
                        )}
                      </div>
                    </div>
                  </td>

                  <td>{user.email}</td>
                  <td>{user.phone || "Chưa cập nhật"}</td>

                  {/* Role */}
                  <td>
                    <span className={`badge ${
                      user.role?.roleName === 'ADMIN'
                        ? 'bg-danger'
                        : 'bg-info'
                    }`}>
                      {user.role?.roleName || 'USER'}
                    </span>
                  </td>

                  <td>{formatDate(user.createdAt)}</td>

                  {/* Status switch */}
                  <td className="text-center">
                    <div className="form-check form-switch d-inline-block">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={user.isActive}
                        id={`switch-${user.userID}`}
                        onChange={() => toggleUserStatus(user.userID, user.isActive)}
                      />
                      <label className="form-check-label" htmlFor={`switch-${user.userID}`}>
                        {user.isActive ? (
                          <span className="text-success">Hoạt động</span>
                        ) : (
                          <span className="text-muted">Bị khóa</span>
                        )}
                      </label>
                    </div>
                  </td>

                  {/* ACTION BUTTONS */}
                  <td>
                    {/* <button className="btn btn-sm btn-outline-primary me-1" title="Xem chi tiết">
                      <i className="bi bi-eye"></i>
                    </button>

                    <button className="btn btn-sm btn-outline-warning me-1" title="Sửa">
                      <i className="bi bi-pencil"></i>
                    </button> */}

                    {/* Đổi vai trò */}
                    <button
                      className="btn btn-sm btn-outline-secondary me-1"
                      title="Đổi vai trò"
                      onClick={() => openRoleModal(user)}
                    >
                      <i className="bi bi-shield-check"></i>
                    </button>

                    {/* Không cho xóa ADMIN */}
                    {/* {user.role?.roleName !== "ADMIN" && (
                      <button className="btn btn-sm btn-outline-danger" title="Xóa">
                        <i className="bi bi-trash"></i>
                      </button>
                    )} */}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {/* Tổng kết */}
      <div className="mt-3 text-muted small">
        Tổng cộng: <strong>{users.length}</strong> tài khoản
        {users.filter(u => u.role?.roleName === 'ADMIN').length > 0 && (
          <> • <strong className="text-danger">
            {users.filter(u => u.role?.roleName === 'ADMIN').length} Quản trị viên
          </strong></>
        )}
      </div>

      {/* MODAL ĐỔI VAI TRÒ */}
      {showRoleModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.5)"
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Đổi vai trò người dùng</h5>
                <button className="btn-close" onClick={() => setShowRoleModal(false)}></button>
              </div>

              <div className="modal-body">
                <p className="fw-bold mb-2">
                  Người dùng: {selectedUser?.fullName}
                </p>

                <label className="form-label">Chọn vai trò mới:</label>
                <select
                  className="form-select"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="MANAGER">MANAGER</option>
                </select>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowRoleModal(false)}>
                  Hủy
                </button>
                <button className="btn btn-primary" onClick={updateUserRole}>
                  Lưu thay đổi
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}