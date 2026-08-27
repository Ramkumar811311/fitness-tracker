const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  registerUser,
  loginUser,
  verifyOTP,
  resendOTP,
  getUserById, // Ensure this function is imported
  updateProfile,
  contactUs
} = require("../controllers/userController");

const router = express.Router();

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname.split(".").pop()
    );
  }
});

const upload = multer({ storage: storage });

// Register route (with OTP verification)
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// OTP verification route
router.post("/verify-otp", verifyOTP);

// Resend OTP route
router.post("/resend-otp", resendOTP);

router.get("/:id", getUserById);

// Update profile route with file upload
router.post("/update-profile", upload.single('profileImage'), updateProfile);

router.post("/contact", contactUs);

module.exports = router;
