import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSave, faUpload, faTimes } from "@fortawesome/free-solid-svg-icons";

const UpdateProfile = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
    height: "",
    weight: "",
    gender: "",
    age: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        name: user.name || "",
        email: user.email || "",
        height: user.height || "",
        weight: user.weight || "",
        gender: user.gender || "",
        age: user.age || "",
      });

      if (user.profileImage) {
        // Handle both absolute URLs and relative paths
        const imageUrl = user.profileImage.startsWith('http')
          ? user.profileImage
          : `${window.location.origin}${user.profileImage}`;
        setPreviewImage(imageUrl);
      }
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.age && (isNaN(formData.age) || formData.age < 1 || formData.age > 120)) {
      newErrors.age = "Please enter a valid age between 1 and 120";
    }

    if (formData.height && (isNaN(formData.height) || formData.height < 1 || formData.height > 300)) {
      newErrors.height = "Please enter a valid height in cm (1-300)";
    }

    if (formData.weight && (isNaN(formData.weight) || formData.weight < 1 || formData.weight > 500)) {
      newErrors.weight = "Please enter a valid weight in kg (1-500)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage" && files && files.length > 0) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });

      // Clear error when user types in field
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: null,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // Only append fields that have values
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== "" && key !== "confirmPassword") {
          formDataToSend.append(key, formData[key]);
        }
      }

      const response = await axios.post(
        `/api/users/update-profile`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the user context with new user data
      login(localStorage.getItem("jwttoken"));

      // Reset password fields
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      });

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setPreviewImage(null);
    setFormData({
      ...formData,
      profileImage: null,
    });
  };

  const inputClasses = "mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out";
  const errorClasses = "mt-1 text-sm text-red-600";

  return (
    <div className="max-w-7xl mx-auto pt-4 px-4">
      <motion.div
        className="bg-white rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FontAwesomeIcon icon={faUser} className="mr-3 text-purple-600" />
            Update Your Profile
          </h2>
          <p className="text-gray-600 mt-1">
            Update your personal information and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Picture Section */}
            <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
              <div className="relative">
                {previewImage ? (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Profile Preview"
                      className="w-24 h-24 object-cover rounded-full border-4 border-purple-100"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center bg-purple-100 rounded-full">
                    <FontAwesomeIcon icon={faUser} className="text-3xl text-purple-300" />
                  </div>
                )}
              </div>

              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Photo
                </label>
                <div className="flex items-center">
                  <label
                    htmlFor="profileImage"
                    className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center transition-colors"
                  >
                    <FontAwesomeIcon icon={faUpload} className="mr-2" />
                    {previewImage ? "Change Photo" : "Upload Photo"}
                    <input
                      id="profileImage"
                      name="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                  <span className="ml-3 text-sm text-gray-500">
                    JPG, PNG or GIF (Max. 2MB)
                  </span>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className={inputClasses}
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`${inputClasses} bg-gray-50 cursor-not-allowed`}
                value={formData.email}
                disabled
              />
              <p className="mt-1 text-xs text-gray-500">Email address cannot be changed</p>
            </div>

            {/* Personal Details */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                className={`${inputClasses} ${errors.age ? "border-red-500" : ""}`}
                value={formData.age}
                onChange={handleChange}
                placeholder="Your age"
              />
              {errors.age && <p className={errorClasses}>{errors.age}</p>}
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                className={inputClasses}
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                Height (cm)
              </label>
              <input
                id="height"
                name="height"
                type="number"
                className={`${inputClasses} ${errors.height ? "border-red-500" : ""}`}
                value={formData.height}
                onChange={handleChange}
                placeholder="Your height in centimeters"
              />
              {errors.height && <p className={errorClasses}>{errors.height}</p>}
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                Weight (kg)
              </label>
              <input
                id="weight"
                name="weight"
                type="number"
                className={`${inputClasses} ${errors.weight ? "border-red-500" : ""}`}
                value={formData.weight}
                onChange={handleChange}
                placeholder="Your weight in kilograms"
              />
              {errors.weight && <p className={errorClasses}>{errors.weight}</p>}
            </div>

            {/* Change Password */}
            <div className="md:col-span-2 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Change Password</h3>
              <p className="text-sm text-gray-500 mb-4">Leave blank if you don't want to change your password</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className={inputClasses}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="New password"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className={`${inputClasses} ${errors.confirmPassword ? "border-red-500" : ""}`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && <p className={errorClasses}>{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UpdateProfile;