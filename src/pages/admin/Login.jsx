// src/pages/admin/Login.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('admin@gmail.com'); // Giữ giá trị test
  const [password, setPassword] = useState('Admin123');
  const [showPassword, setShowPassword] = useState(false); // State để toggle hiện/ẩn mật khẩu
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      // Hiển thị thông báo lỗi chi tiết hơn nếu có từ backend
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  // Style tùy chỉnh cho nền gradient
  const backgroundStyle = {
    background: 'linear-gradient(135deg, #e0f2ff 0%, #f0f7ff 100%)',
    minHeight: '100vh',
  };

  // Style để input trông liền mạch với icon
  const inputGroupTextStyle = {
    backgroundColor: '#f8f9fa', // Màu xám nhạt giống mẫu
    borderRight: 'none',
  };
  
  const inputFieldStyle = {
    backgroundColor: '#f8f9fa',
    borderLeft: 'none',
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={backgroundStyle}>
      <div className="card border-0 shadow-lg rounded-4 p-4" style={{ width: '100%', maxWidth: '420px' }}>
        <div className="card-body">
          
          {/* --- HEADER --- */}
          <div className="text-center mb-4">
            <div className="bg-primary bg-opacity-10 text-primary rounded p-3 d-inline-block mb-3">
                {/* Sử dụng Bootstrap Icon làm logo tạm */}
                <i className="bi bi-shield-lock-fill fs-2"></i>
            </div>
            <h4 className="fw-bold mb-1">Chào mừng trở lại!</h4>
            <p className="text-muted small mb-0">Đăng nhập để quản lý hệ thống Shop Admin</p>
          </div>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}

          {/* --- FORM --- */}
          <form onSubmit={handleSubmit}>
            {/* Input Email */}
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text text-muted" style={inputGroupTextStyle}>
                    <i className="bi bi-person"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  style={inputFieldStyle}
                  placeholder="Tên đăng nhập / Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="mb-4">
              <div className="input-group">
                <span className="input-group-text text-muted" style={inputGroupTextStyle}>
                    <i className="bi bi-lock"></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  style={inputFieldStyle}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {/* Nút toggle hiện/ẩn mật khẩu */}
                <button 
                    className="btn btn-light text-muted border border-start-0" 
                    type="button"
                    style={{backgroundColor: '#f8f9fa'}}
                    onClick={() => setShowPassword(!showPassword)}
                >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
                type="submit" 
                className="btn btn-primary w-100 py-2 fw-bold rounded-3 shadow-sm"
                disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Đang xử lý...
                </>
              ) : (
                'Đăng Nhập'
              )}
            </button>
          </form>

          {/* --- FOOTER LINKS --- */}
          <div className="d-flex justify-content-between mt-4 small">
            <a href="#" className="text-decoration-none text-muted" onClick={(e) => e.preventDefault()}>Quên mật khẩu?</a>
            <Link to="/" className="text-decoration-none text-primary fw-bold">
                Về trang chủ <i className="bi bi-arrow-right-short"></i>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}