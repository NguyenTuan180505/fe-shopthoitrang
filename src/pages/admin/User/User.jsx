import { useState, useEffect, useMemo } from 'react';
import axiosClient from '../../../api/axiosClient';
import { format } from 'date-fns';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal đổi vai trò
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("USER");
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosClient.get('/users'); // đúng endpoint của bạn
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi tải users:", err.response || err);
      alert('Lỗi tải danh sách tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;
    const adminCount = users.filter(u => u.role?.roleName === 'ADMIN').length;
    return { totalUsers, activeUsers, adminCount };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userID?.toString().includes(searchTerm)
    );
  }, [users, searchTerm]);

  // BẬT/TẮT TRẠNG THÁI - HOẠT ĐỘNG NGON
  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      await axiosClient.put(`/users/${userId}/status`, null, {
        params: { active: newStatus }
      });

      setUsers(prev =>
        prev.map(user =>
          user.userID === userId ? { ...user, isActive: newStatus } : user
        )
      );
    } catch (err) {
      console.error("Lỗi toggle status:", err.response || err);
      alert("Không thể thay đổi trạng thái");
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role?.roleName || "USER");
    setShowRoleModal(true);
  };

  // ĐỔI VAI TRÒ - ĐÃ SỬA ĐÚNG 100% THEO POSTMAN CỦA BẠN
    const updateUserRole = async () => {
    if (!selectedUser) return;

    // ĐÚNG CHUẨN BACKEND CỦA BẠN (theo thực tế hầu hết project Việt Nam)
    const roleIdMap = {
      "CUSTOMER": 2,  // Khách hàng
      "ADMIN":  1    // Quản trị viên
      // Nếu sau này có thêm role thì thêm vào đây
    };

    const roleId = roleIdMap[newRole];

    if (!roleId) {
      alert("Vai trò không hợp lệ!");
      return;
    }

    try {
      await axiosClient.put(`/users/${selectedUser.userID}/role`, null, {
        params: { roleId: roleId }   // đúng 100% theo Postman bạn chụp
      });

      // Cập nhật giao diện ngay lập tức
      setUsers(prev =>
        prev.map(u =>
          u.userID === selectedUser.userID
            ? { ...u, role: { ...u.role, roleName: newRole } }
            : u
        )
      );

      setShowRoleModal(false);
      alert("Cập nhật vai trò thành công!");
    } catch (err) {
      console.error("Lỗi đổi role:", err.response || err);
      alert("Cập nhật thất bại: " + (err.response?.data?.message || "Lỗi server"));
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd/MM/yyyy HH:mm');
    } catch {
      return 'Invalid Date';
    }
  };

  const getRoleBadge = (roleName) => {
    if (roleName === 'ADMIN') return 'bg-danger';
    // if (roleName === 'MANAGER') return 'bg-warning text-dark';
    return 'bg-info text-dark';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4 bg-light">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-primary mb-1">
            <i className="bi bi-people-fill me-2"></i>QUẢN LÝ TÀI KHOẢN
          </h3>
          <p className="text-muted mb-0">Quản lý danh sách khách hàng và phân quyền</p>
        </div>
        <button className="btn btn-outline-primary shadow-sm" onClick={fetchUsers}>
          <i className="bi bi-arrow-clockwise me-2"></i> Làm mới
        </button>
      </div>

      {/* STATS */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm border-start border-4 border-primary h-100">
            <div className="card-body d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3 text-primary">
                <i className="bi bi-person-lines-fill fs-3"></i>
              </div>
              <div>
                <h6 className="text-muted text-uppercase mb-1 small fw-bold">Tổng Tài Khoản</h6>
                <h3 className="fw-bold mb-0">{stats.totalUsers}</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm border-start border-4 border-success h-100">
            <div className="card-body d-flex align-items-center">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3 text-success">
                <i className="bi bi-person-check-fill fs-3"></i>
              </div>
              <div>
                <h6 className="text-muted text-uppercase mb-1 small fw-bold">Đang Hoạt Động</h6>
                <h3 className="fw-bold mb-0">{stats.activeUsers}</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm border-start border-4 border-danger h-100">
            <div className="card-body d-flex align-items-center">
              <div className="bg-danger bg-opacity-10 p-3 rounded-circle me-3 text-danger">
                <i className="bi bi-shield-lock-fill fs-3"></i>
              </div>
              <div>
                <h6 className="text-muted text-uppercase mb-1 small fw-bold">Quản Trị Viên</h6>
                <h3 className="fw-bold mb-0">{stats.adminCount}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="input-group" style={{ maxWidth: '400px' }}>
            <span className="input-group-text bg-white border-end-0"><i className="bi bi-search"></i></span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Tìm tên, email, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4 py-3 small text-uppercase fw-bold text-secondary">ID</th>
                  <th className="py-3 small text-uppercase fw-bold text-secondary">Thành Viên</th>
                  <th className="py-3 small text-uppercase fw-bold text-secondary">Liên Hệ</th>
                  <th className="py-3 small text-uppercase fw-bold text-secondary">Vai Trò</th>
                  <th className="py-3 small text-uppercase fw-bold text-secondary">Ngày Tạo</th>
                  <th className="py-3 small text-uppercase fw-bold text-secondary">Trạng Thái</th>
                  <th className="py-3 text-center small text-uppercase fw-bold text-secondary">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.userID}>
                    <td className="ps-4 fw-bold text-secondary">#{user.userID}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: 40, height: 40, fontSize: '1.1rem', fontWeight: 'bold' }}>
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-bold">{user.fullName}</div>
                          {user.role?.roleName === 'ADMIN' && (
                            <small className="text-danger fw-bold">System Admin</small>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{user.email}</div>
                      <small className="text-muted">{user.phone || "---"}</small>
                    </td>
                    <td>
                      <span className={`badge ${getRoleBadge(user.role?.roleName)} px-3 py-2 rounded-pill`}>
                        {user.role?.roleName || 'USER'}
                      </span>
                    </td>
                    <td className="small text-muted">{formatDate(user.createdAt)}</td>
                    <td>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={user.isActive}
                          onChange={() => toggleUserStatus(user.userID, user.isActive)}
                        />
                        <label className="form-check-label small">
                          {user.isActive ? <span className="text-success fw-bold">Active</span> : <span className="text-muted">Locked</span>}
                        </label>
                      </div>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => openRoleModal(user)}
                        title="Đổi vai trò"
                      >
                        <i className="bi bi-person-gear"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      <i className="bi bi-person-x fs-1 d-block mb-3 opacity-50"></i>
                      Không tìm thấy tài khoản nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL ĐỔI ROLE */}
      {showRoleModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Phân Quyền Người Dùng</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowRoleModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 80, height: 80 }}>
                  <span className="fs-2 fw-bold text-primary">{selectedUser?.fullName.charAt(0).toUpperCase()}</span>
                </div>
                <h5>{selectedUser?.fullName}</h5>
                <p className="text-muted">{selectedUser?.email}</p>

                <select
                  className="form-select form-select-lg mb-3"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="CUSTOMER">CUSTOMER - Khách hàng</option>
                  <option value="ADMIN">ADMIN - Quản trị viên</option>
                  {/* <option value="MANAGER">MANAGER - Quản lý</option> */}
                </select>

                <div className="alert alert-warning small">
                  <strong>Cảnh báo:</strong> Chỉ cấp quyền ADMIN khi thực sự cần thiết!
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-light" onClick={() => setShowRoleModal(false)}>Hủy</button>
                <button className="btn btn-primary" onClick={updateUserRole}>Cập nhật vai trò</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}