const nodemailer = require("nodemailer");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const verificationEmail = require("../emailTemplates/verificationEmail");
const util = require("util");

// =====================================================
// EMAIL TRANSPORTER
// =====================================================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// =====================================================
// GENERATE OTP
// =====================================================

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// =====================================================
// REGISTER USER
// =====================================================

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if verified user already exists
    const userExists = await User.findOne({
      email,
      isVerified: true,
    });

    // Check if unverified user exists
    const userNotVerified = await User.findOne({
      email,
      isVerified: false,
    });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Delete old unverified account
    if (userNotVerified) {
      await userNotVerified.deleteOne();
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();

    const otpExpiry = new Date();
    otpExpiry.setMinutes(
      otpExpiry.getMinutes() + 10
    );

    // =================================================
    // OTP EMAIL
    // =================================================

    const emailContent = `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 5px;
        "
      >

        <h2 style="color: #333;">
          Verify Your Email
        </h2>

        <p>Hello ${name},</p>

        <p>
          Thank you for registering with FitFusion.
          To complete your registration, please use
          the following OTP:
        </p>

        <div
          style="
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            font-size: 24px;
            letter-spacing: 5px;
            font-weight: bold;
          "
        >
          ${otp}
        </div>

        <p style="margin-top: 20px;">
          This OTP is valid for 10 minutes.
        </p>

        <p>
          If you didn't request this, please ignore this email.
        </p>

        <p>
          Best regards,<br />
          The FitFusion Team
        </p>

      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for FitFusion Registration",
      html: emailContent,
    };

    // Send email
    const sendMailPromise = util
      .promisify(transporter.sendMail)
      .bind(transporter);

    await sendMailPromise(mailOptions);

    // =================================================
    // CREATE USER AFTER EMAIL SUCCESS
    // =================================================

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
    });

    await user.save();

    res.status(201).json({
      message:
        "OTP sent to your email. Please verify to complete registration.",
      email: email,
    });
  } catch (error) {
    console.error(
      "Error registering user:",
      error
    );

    res.status(500).json({
      message:
        "Failed to register user. Please try again.",
    });
  }
};

// =====================================================
// VERIFY OTP
// =====================================================

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Check expiry
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    // Verify user
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.status(200).json({
      message: "Email verified successfully",
      token,
      name: user.name,
    });
  } catch (error) {
    console.error(
      "Error verifying OTP:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =====================================================
// RESEND OTP
// =====================================================

const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Find unverified user
    const user = await User.findOne({
      email,
      isVerified: false,
    });

    if (!user) {
      return res.status(400).json({
        message:
          "User not found or already verified",
      });
    }

    // Generate new OTP
    const otp = generateOTP();

    const otpExpiry = new Date();

    otpExpiry.setMinutes(
      otpExpiry.getMinutes() + 10
    );

    // =================================================
    // RESEND EMAIL
    // =================================================

    const emailContent = `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 5px;
        "
      >

        <h2 style="color: #333;">
          Your New OTP
        </h2>

        <p>
          Hello ${user.name},
        </p>

        <p>
          You requested a new OTP.
          Please use the following code
          to verify your account:
        </p>

        <div
          style="
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            font-size: 24px;
            letter-spacing: 5px;
            font-weight: bold;
          "
        >
          ${otp}
        </div>

        <p style="margin-top: 20px;">
          This OTP is valid for 10 minutes.
        </p>

        <p>
          If you didn't request this, please ignore this email.
        </p>

        <p>
          Best regards,<br />
          The FitFusion Team
        </p>

      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject:
        "Your New OTP for FitFusion Registration",
      html: emailContent,
    };

    // Send email
    const sendMailPromise = util
      .promisify(transporter.sendMail)
      .bind(transporter);

    await sendMailPromise(mailOptions);

    // Update OTP
    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();

    res.status(200).json({
      message: "New OTP sent to your email",
    });
  } catch (error) {
    console.error(
      "Error resending OTP:",
      error
    );

    res.status(500).json({
      message:
        "Failed to resend OTP. Please try again.",
    });
  }
};

// =====================================================
// LOGIN USER
// =====================================================

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      email,
    });

    if (
      user &&
      (await bcrypt.compare(
        password,
        user.password
      ))
    ) {
      if (!user.isVerified) {
        return res.status(400).json({
          message: "Email not verified",
        });
      }

      // Generate JWT
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      return res.status(200).json({
        token,
      });
    } else {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.error(
      "Error logging in user:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// GET USER BY ID
// =====================================================

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =====================================================
// UPDATE PROFILE
// =====================================================

const updateProfile = async (req, res) => {
  try {
    console.log(
      "Update Profile Request:",
      req.body
    );

    console.log(
      "Update Profile File:",
      req.file
    );

    const {
      email,
      name,
      password,
      height,
      weight,
      gender,
      age,
    } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update fields
    if (name) user.name = name;

    if (height) user.height = height;

    if (weight) user.weight = weight;

    if (gender) user.gender = gender;

    if (age) user.age = age;

    // Update profile image
    if (req.file) {
      user.profileImage =
        `/uploads/${req.file.filename.replace(
          /\\/g,
          "/"
        )}`;
    }

    // Update password
    if (
      password &&
      password.trim() !== ""
    ) {
      user.password =
        await bcrypt.hash(
          password,
          10
        );
    }

    // Save
    const updatedUser =
      await user.save();

    console.log(
      "User updated successfully:",
      updatedUser.name
    );

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profileImage:
        updatedUser.profileImage,
      height: updatedUser.height,
      weight: updatedUser.weight,
      gender: updatedUser.gender,
      age: updatedUser.age,
    });
  } catch (error) {
    console.error(
      "Error updating profile:",
      error
    );

    res.status(500).json({
      message: "Error updating profile",
      error: error.message,
    });
  }
};

// =====================================================
// CONTACT US
// =====================================================

const contactUs = async (req, res) => {
  const {
    name,
    email,
    message,
  } = req.body;

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,

      to: "ramkumar070406@gmail.com",

      subject:
        "New Contact Form Submission",

      html: `
        <h1>
          New Contact Form Submission
        </h1>

        <p>
          <strong>Name:</strong>
          ${name}
        </p>

        <p>
          <strong>Email:</strong>
          ${email}
        </p>

        <p>
          <strong>Message:</strong>
          ${message}
        </p>
      `,
    };

    // Send contact email
    await transporter.sendMail(
      mailOptions
    );

    res.status(200).json({
      message:
        "Your message has been sent successfully!",
    });
  } catch (error) {
    console.error(
      "Error sending contact form email:",
      error
    );

    res.status(500).json({
      message:
        "Failed to send your message. Please try again later.",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  registerUser,
  loginUser,
  verifyOTP,
  resendOTP,
  getUserById,
  updateProfile,
  contactUs,
};