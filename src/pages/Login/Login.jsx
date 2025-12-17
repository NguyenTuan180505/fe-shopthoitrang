import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useUserAuth } from "../../context/UserAuthContext";
import { useNavigate, Link, Navigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useUserAuth();
  const navigate = useNavigate();

  // ✅ NẾU ĐÃ LOGIN → ĐÁ SANG PROFILE
  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Vui lòng điền đầy đủ email và mật khẩu");
      return;
    }

    setIsLoading(true);
    try {
      const ok = await login(email, password);

      if (ok) {
        localStorage.setItem("otp_email", email);
        navigate("/verify-otp");
      } else {
        setErrorMsg("Email hoặc mật khẩu không đúng!");
      }
    } catch {
      setErrorMsg("Email hoặc mật khẩu không đúng!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-blob login-blob-1"></div>
      <div className="login-blob login-blob-2"></div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon-circle">
              <Lock className="login-icon" size={28} />
            </div>
            <h1 className="login-title">Đăng nhập</h1>
            <p className="login-subtitle">Truy cập tài khoản của bạn</p>
          </div>

          {errorMsg && (
            <div className="login-error">
              <AlertCircle size={20} />
              <p>{errorMsg}</p>
            </div>
          )}

          <div className="login-form">
            <div className="login-form-group">
              <label htmlFor="email" className="login-label">
                Email
              </label>
              <div className="login-input-wrapper">
                <Mail className="login-input-icon" size={20} />
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="login-input"
                />
              </div>
            </div>

            <div className="login-form-group">
              <label htmlFor="password" className="login-label">
                Mật khẩu
              </label>
              <div className="login-input-wrapper">
                <Lock className="login-input-icon" size={20} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="login-input"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                  disabled={isLoading}
                  className="login-password-toggle"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="login-remember-forgot">
              <label className="login-checkbox-label">
                <input
                  type="checkbox"
                  disabled={isLoading}
                  className="login-checkbox"
                />
                <span>Nhớ tôi</span>
              </label>
              <a href="#" className="login-forgot-link">
                Quên mật khẩu?
              </a>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="login-submit-btn"
            >
              {isLoading ? (
                <>
                  <div className="login-spinner"></div>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </div>

          <p className="login-footer">
            Chưa có tài khoản?{" "}
            <Link to="/signup" className="login-signup-link">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        <p className="login-copyright">
          © 2024 Your Fashion Store. All rights reserved.
        </p>
      </div>
    </div>
  );
}
