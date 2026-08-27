import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUser, faEnvelope, faLock, faHeartPulse, faDumbbell, faShield, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `/api/users/register`,
        {
          name,
          email,
          password,
        }
      );

      toast.success(response.data.message);

      // Redirect to OTP verification page with email
      navigate(`/verify-otp?email=${email}`);
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Features list for the benefits card
  const features = [
    { icon: faDumbbell, text: "Custom Workouts" },
    { icon: faHeartPulse, text: "Health Tracking" },
    { icon: faShield, text: "Secure Profile" },
    { icon: faChartLine, text: "Progress Analytics" }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-green-50 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden -mt-20">
        {/* Left side: Registration form */}
        <div className="w-full md:w-1/2 p-6">
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-4 bg-white rounded-lg shadow-md px-6 py-4 border border-green-100">
              <h2 className="text-green-700 text-2xl font-bold text-center">FitFusion</h2>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800">Create Account</h2>
            <p className="text-gray-500 text-sm mt-1 text-center">Join our fitness community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faUser}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  required
                  className="w-full pl-10 pr-4 py-2 border-b border-gray-300 focus:border-green-500 focus:outline-none bg-transparent text-gray-700 text-sm"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full pl-10 pr-4 py-2 border-b border-gray-300 focus:border-green-500 focus:outline-none bg-transparent text-gray-700 text-sm"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-10 py-2 border-b border-gray-300 focus:border-green-500 focus:outline-none bg-transparent text-gray-700 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="text-gray-400 hover:text-gray-600"
                  />
                </button>
              </div>
            </div>

            <div>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  required
                  className="w-full pl-10 pr-10 py-2 border-b border-gray-300 focus:border-green-500 focus:outline-none bg-transparent text-gray-700 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                    className="text-gray-400 hover:text-gray-600"
                  />
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 text-center bg-green-600 text-white font-medium rounded-lg transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              Already have an account?{" "}
              <Link to="/SignIn" className="text-green-600 font-medium hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Right side: Benefits card */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-green-50 to-green-100 p-6 flex flex-col justify-center">
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              FitFusion Benefits
            </h3>

            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center py-2">
                  <div className="bg-green-100 p-3 rounded-full mr-4 w-12 h-12 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={feature.icon}
                      className="text-green-600 text-lg"
                    />
                  </div>
                  <span className="text-gray-700 text-md font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-center text-blue-800">
                  "FitFusion helped me achieve my fitness goals with personalized workout plans."
                </p>
                <p className="text-xs text-center text-blue-600 mt-2">
                  — Sarah J., Member since 2022
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
