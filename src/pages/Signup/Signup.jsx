import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle, User, Check } from "lucide-react";
import { useUserAuth } from "../../context/UserAuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { signup } = useUserAuth();
  const navigate = useNavigate();

  // ===== KIỂM TRA ĐỘ MẠNH MẬT KHẨU =====
  const checkPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    return strength;
  };

  // ===== HANDLE INPUT =====
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  // ===== VALIDATION =====
  const validateForm = () => {
    if (!formData.fullName.trim()) return setError("Vui lòng nhập họ tên");
    if (!formData.email.trim()) return setError("Vui lòng nhập email");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return setError("Email không hợp lệ");

    if (formData.password.length < 8)
      return setError("Mật khẩu phải có ít nhất 8 ký tự");

    if (formData.password !== formData.confirmPassword)
      return setError("Mật khẩu không khớp");

    return true;
  };

  const setError = (msg) => {
    setErrorMsg(msg);
    return false;
  };

  // ===== HANDLE SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const ok = await signup(
        formData.fullName,
        formData.email,
        formData.password,
        formData.phone
      );

      if (ok) {
        setSuccessMsg("Đăng ký thành công! Chuyển hướng...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setErrorMsg("Email đã được sử dụng. Vui lòng thử email khác.");
      }
    } catch {
      setErrorMsg("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // ===== MÀU & LABEL ĐỘ MẠNH MẬT KHẨU =====
  const getStrengthLabel = () =>
    ["Rất yếu", "Yếu", "Trung bình", "Mạnh", "Rất mạnh"][passwordStrength] ||
    "";

  const getStrengthColor = () =>
    ["#d32f2f", "#f57c00", "#fbc02d", "#689f38", "#388e3c"][passwordStrength] ||
    "#ccc";

  return (
    <div className="signup-wrapper">
      <div className="signup-blob signup-blob-1"></div>
      <div className="signup-blob signup-blob-2"></div>

      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <div className="signup-icon-circle">
              <User size={28} />
            </div>
            <h1 className="signup-title">Đăng ký</h1>
            <p className="signup-subtitle">Tạo tài khoản mới của bạn</p>
          </div>

          {errorMsg && (
            <div className="signup-error">
              <AlertCircle size={20} />
              <p>{errorMsg}</p>
            </div>
          )}

          {successMsg && (
            <div className="signup-success">
              <Check size={20} />
              <p>{successMsg}</p>
            </div>
          )}

          <form className="signup-form" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="signup-form-group">
              <label className="signup-label">Họ và tên</label>
              <div className="signup-input-wrapper">
                <User size={20} className="signup-input-icon" />
                <input
                  name="fullName"
                  placeholder="Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="signup-input"
                />
              </div>
            </div>

            {/* Email */}
            <div className="signup-form-group">
              <label className="signup-label">Email</label>
              <div className="signup-input-wrapper">
                <Mail size={20} className="signup-input-icon" />
                <input
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="signup-input"
                />
              </div>
            </div>

            {/* Password */}
            <div className="signup-form-group">
              <label className="signup-label">Mật khẩu</label>
              <div className="signup-input-wrapper">
                <Lock size={20} className="signup-input-icon" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="signup-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="signup-password-toggle"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {formData.password && (
                <div className="signup-password-strength">
                  <div className="signup-strength-bar">
                    <div
                      className="signup-strength-fill"
                      style={{
                        width: `${(passwordStrength / 5) * 100}%`,
                        backgroundColor: getStrengthColor(),
                      }}
                    />
                  </div>
                  <span
                    className="signup-strength-text"
                    style={{ color: getStrengthColor() }}
                  >
                    {getStrengthLabel()}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="signup-form-group">
              <label className="signup-label">Xác nhận mật khẩu</label>
              <div className="signup-input-wrapper">
                <Lock size={20} className="signup-input-icon" />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="signup-input"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="signup-password-toggle"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Phone */}
            <div className="signup-form-group">
              <label className="signup-label">Số điện thoại</label>
              <div className="signup-input-wrapper">
                <Mail size={20} className="signup-input-icon" />
                <input
                  name="phone"
                  placeholder="0912345678"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="signup-input"
                />
              </div>
            </div>

            {/* Submit */}
            <button className="signup-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="signup-spinner"></div>
                  Đang tạo tài khoản...
                </>
              ) : (
                "Đăng ký"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="signup-footer">
            Đã có tài khoản?{" "}
            <Link to="/login" className="signup-login-link">
              Đăng nhập
            </Link>
          </p>
        </div>

        <p className="signup-copyright">
          © 2025 Your Fashion Store. All rights reserved.
        </p>
      </div>
    </div>
  );
}
