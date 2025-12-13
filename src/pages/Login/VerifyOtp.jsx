import { useEffect, useState } from "react";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";
import "./VerifyOtp.css";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { verifyOtp } = useUserAuth();

  const email = localStorage.getItem("otp_email");

  useEffect(() => {
    if (!email) navigate("/login");
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!otp) {
      setErrorMsg("Vui lòng nhập mã OTP");
      return;
    }

    setIsLoading(true);
    const ok = await verifyOtp(email, otp);

    if (ok) {
      localStorage.removeItem("otp_email");
      navigate("/profile", { replace: true });
    } else {
      setErrorMsg("Mã OTP không đúng hoặc đã hết hạn");
    }

    setIsLoading(false);
  };

  return (
    <div className="verify-wrapper">
      <div className="verify-blob verify-blob-1"></div>
      <div className="verify-blob verify-blob-2"></div>

      <div className="verify-container">
        <div className="verify-card">
          <div className="verify-header">
            <div className="verify-icon-circle">
              <ShieldCheck className="verify-icon" size={28} />
            </div>
            <h1 className="verify-title">Xác thực OTP</h1>
            <p className="verify-subtitle">Nhập mã OTP đã gửi về email của bạn</p>
          </div>

          {errorMsg && (
            <div className="verify-error">
              <AlertCircle size={20} />
              <p>{errorMsg}</p>
            </div>
          )}

          <form className="verify-form" onSubmit={handleVerify}>
            <div className="verify-input-wrapper">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                disabled={isLoading}
                placeholder="000000"
                className="verify-input"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="verify-submit-btn"
            >
              {isLoading ? (
                <>
                  <div className="verify-spinner"></div>
                  <span>Đang xác thực...</span>
                </>
              ) : (
                "Xác nhận"
              )}
            </button>
          </form>

          <p className="verify-footer">
            Không nhận được mã? <a href="#" className="verify-resend-link">Gửi lại</a>
          </p>
        </div>

        <p className="verify-copyright">
          © 2024 Your Fashion Store. All rights reserved.
        </p>
      </div>
    </div>
  );
}