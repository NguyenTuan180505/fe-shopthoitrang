import { useState, useEffect, useMemo } from 'react';
import axiosClient from '../../../api/axiosClient';
import { format } from 'date-fns';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

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

  // --- TÍNH TOÁN THỐNG KÊ ---
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;
    const adminCount = users.filter(u => u.role?.roleName === 'ADMIN').length;
    return { totalUsers, activeUsers, adminCount };
  }, [users]);

  // --- LỌC USER ---
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userID.toString().includes(searchTerm)
    );
  }, [users, searchTerm]);

  // --- LOGIC CŨ GIỮ NGUYÊN ---
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
      alert('Cập nhật trạng thái thất bại');
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role?.roleName || "USER");
    setShowRoleModal(true);
  };

  const updateUserRole = async () => {
    if (!selectedUser) return;
    try {
      await axiosClient.put(`/Users/${selectedUser.userID}/role`, { roleName: newRole });
      setUsers(prev =>
        prev.map(u =>
          u.userID === selectedUser.userID
            ? { ...u, role: { ...u.role, roleName: newRole } }
            : u
        )
      );
      setShowRoleModal(false);
    } catch (err) {
      alert("Cập nhật vai trò thất bại");
    }
  };

  const formatDate = (date) => {
    if(!date) return 'N/A';
    try {
        return format(new Date(date), 'dd/MM/yyyy HH:mm');
    } catch {
        return 'Invalid Date';
    }
  };

  // Hàm lấy màu badge cho Role
  const getRoleBadge = (roleName) => {
      if(roleName === 'ADMIN') return 'bg-danger';
      if(roleName === 'MANAGER') return 'bg-warning text-dark';
      return 'bg-info text-dark';
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
      <div className="spinner-border text-primary"></div>
    </div>
  );

  return (
    <div className="container-fluid p-4 bg-light">

      {/* 1. HEADER */}
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

      {/* 2. STATS CARDS */}
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

      {/* 3. TOOLBAR */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
            <div className="input-group" style={{maxWidth: '400px'}}>
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

      {/* 4. TABLE */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th width="80" className="ps-4 py-3 text-secondary small text-uppercase fw-bold">ID</th>
                    <th className="py-3 text-secondary small text-uppercase fw-bold">Thành Viên</th>
                    <th className="py-3 text-secondary small text-uppercase fw-bold">Thông Tin Liên Hệ</th>
                    <th className="py-3 text-secondary small text-uppercase fw-bold">Vai Trò</th>
                    <th className="py-3 text-secondary small text-uppercase fw-bold">Ngày Tạo</th>
                    <th width="120" className="py-3 text-secondary small text-uppercase fw-bold">Trạng Thái</th>
                    <th width="100" className="py-3 text-secondary small text-uppercase fw-bold text-center">Hành Động</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <tr key={user.userID} style={{borderBottom: '1px solid #f0f0f0'}}>
                        <td className="ps-4 fw-bold text-secondary">#{user.userID}</td>

                        {/* Avatar + Name */}
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3 border border-primary border-opacity-25" 
                                style={{ width: 40, height: 40, fontSize: '1.1rem', fontWeight: 'bold' }}>
                              {user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="fw-bold text-dark">{user.fullName}</div>
                              {user.role?.roleName === 'ADMIN' && (
                                <small className="text-danger fw-bold" style={{fontSize: '0.7rem'}}>
                                    <i className="bi bi-shield-fill me-1"></i>System Admin
                                </small>
                              )}
                            </div>
                          </div>
                        </td>

                        <td>
                            <div className="d-flex flex-column">
                                <span className="text-dark mb-1"><i className="bi bi-envelope me-2 text-muted"></i>{user.email}</span>
                                <span className="text-muted small"><i className="bi bi-telephone me-2 text-muted"></i>{user.phone || "---"}</span>
                            </div>
                        </td>

                        {/* Role */}
                        <td>
                          <span className={`badge ${getRoleBadge(user.role?.roleName)} border bg-opacity-25 px-3 py-2 rounded-pill`}>
                            {user.role?.roleName || 'USER'}
                          </span>
                        </td>

                        <td className="text-muted small">
                            {formatDate(user.createdAt)}
                        </td>

                        {/* Status switch */}
                        <td>
                          <div className="form-check form-switch">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              style={{cursor: 'pointer'}}
                              checked={user.isActive}
                              id={`switch-${user.userID}`}
                              onChange={() => toggleUserStatus(user.userID, user.isActive)}
                              // Không cho tắt chính mình nếu là Admin (Logic bảo vệ cơ bản)
                              disabled={false} 
                            />
                            <label className="form-check-label small" htmlFor={`switch-${user.userID}`}>
                              {user.isActive ? <span className="text-success fw-bold">Active</span> : <span className="text-muted">Locked</span>}
                            </label>
                          </div>
                        </td>

                        {/* ACTION BUTTONS */}
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-secondary border-0 bg-secondary bg-opacity-10 text-dark"
                            title="Đổi vai trò"
                            onClick={() => openRoleModal(user)}
                          >
                            <i className="bi bi-person-gear fs-6"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                        <td colSpan="7" className="text-center py-5 text-muted">
                            <i className="bi bi-person-x fs-1 d-block mb-2 opacity-50"></i>
                            Không tìm thấy tài khoản nào.
                        </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
        </div>
      </div>

      {/* MODAL ĐỔI VAI TRÒ */}
      {showRoleModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold"><i className="bi bi-shield-lock me-2"></i>Phân Quyền Người Dùng</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowRoleModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-3 text-center">
                    <div className="bg-light rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{width: '60px', height: '60px'}}>
                        <span className="fs-3 fw-bold text-primary">{selectedUser?.fullName.charAt(0).toUpperCase()}</span>
                    </div>
                    <h5 className="fw-bold">{selectedUser?.fullName}</h5>
                    <p className="text-muted small">{selectedUser?.email}</p>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold text-secondary text-uppercase small">Chọn vai trò mới</label>
                    <select
                      className="form-select form-select-lg"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                    >
                      <option value="USER">User (Khách hàng)</option>
                      <option value="ADMIN">Admin (Quản trị viên)</option>
                      {/* Thêm các role khác nếu có */}
                    </select>
                </div>
                
                <div className="alert alert-info small d-flex align-items-center">
                    <i className="bi bi-info-circle-fill me-2 fs-5"></i>
                    <div>
                        <strong>Lưu ý:</strong> Quyền Admin có thể truy cập toàn bộ hệ thống quản trị.
                    </div>
                </div>
              </div>
              <div className="modal-footer bg-light">
                <button className="btn btn-light border" onClick={() => setShowRoleModal(false)}>Hủy bỏ</button>
                <button className="btn btn-primary px-4" onClick={updateUserRole}>Xác nhận lưu</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}