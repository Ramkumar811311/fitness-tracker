import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faCheck, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import "../css/VerifyOTP.css";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [otpRefs] = useState(Array(6).fill(0).map(() => React.createRef()));

  useEffect(() => {
    // Extract email from URL params or location state
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email") || (location.state && location.state.email);

    if (emailParam) {
      setEmail(emailParam);
    } else {
      navigate("/register");
      toast.error("Please register first");
    }
  }, [location, navigate]);

  useEffect(() => {
    // Timer for resend button
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value !== "" && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input field
    if (value !== "" && index < 5) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current field is empty
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`/api/users/verify-otp`, {
        email,
        otp: otpString,
      });

      setSuccess(true);

      // Store token in localStorage and login the user
      localStorage.setItem("jwttoken", response.data.token);

      // Use the auth context login function
      login(response.data.token);

      toast.success("Email verified successfully!");

      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.message || "Verification failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      await axios.post(`/api/users/resend-otp`, { email });
      toast.success("New OTP sent to your email");
      setTimeLeft(60); // 60 seconds cooldown

      // Reset OTP input fields
      setOtp(["", "", "", "", "", ""]);
      otpRefs[0].current.focus();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to resend OTP. Please try again.";
      toast.error(message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="verify-otp-container">
      <div className="verify-otp-card">
        <div className="verify-otp-header">
          <h2>Verify Your Email</h2>
          <p>
            We've sent a 6-digit verification code to <strong>{email}</strong>
          </p>
        </div>

        {success ? (
          <div className="verification-success">
            <div className="success-icon">
              <FontAwesomeIcon icon={faCheck} />
            </div>
            <h3>Verification Successful!</h3>
            <p>You'll be redirected to the homepage.</p>
          </div>
        ) : (
          <form onSubmit={handleVerify}>
            <div className="otp-input-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={otpRefs[index]}
                  className="otp-input"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button
              type="submit"
              className="verify-btn"
              disabled={loading || otp.join("").length !== 6}
            >
              {loading ? (
                <><FontAwesomeIcon icon={faCircleNotch} spin /> Verifying...</>
              ) : (
                <>Verify OTP</>
              )}
            </button>

            <div className="resend-container">
              <p>Didn't receive the code?</p>
              {timeLeft > 0 ? (
                <p className="cooldown">Resend available in {timeLeft}s</p>
              ) : (
                <button
                  type="button"
                  className="resend-btn"
                  onClick={handleResendOTP}
                  disabled={resendLoading}
                >
                  {resendLoading ? (
                    <><FontAwesomeIcon icon={faCircleNotch} spin /> Sending...</>
                  ) : (
                    <>Resend OTP</>
                  )}
                </button>
              )}
            </div>
          </form>
        )}

        <div className="verify-otp-footer">
          <Link to="/register">Change Email</Link>
          <Link to="/signin">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP; 