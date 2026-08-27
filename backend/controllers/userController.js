const { Resend } = require("resend");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// =====================================================
// RESEND EMAIL CLIENT
// =====================================================

const resend = new Resend(process.env.RESEND_API_KEY);

// =====================================================
// EMAIL FROM ADDRESS
// =====================================================

// IMPORTANT:
// Use an email/domain that is verified in your Resend account.
//
// For testing, use the sender address shown/allowed
// by your Resend dashboard.
//
// Example:
// const FROM_EMAIL = "FitFusion <onboarding@resend.dev>";
//
// For production with your own verified domain:
// const FROM_EMAIL = "FitFusion <noreply@yourdomain.com>";

const FROM_EMAIL = "FitFusion <onboarding@resend.dev>";

// =====================================================
// GENERATE OTP
// =====================================================

const generateOTP = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
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

    // Delete old unverified user
    if (userNotVerified) {
      await userNotVerified.deleteOne();
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Generate OTP
    const otp = generateOTP();

    // OTP expiry = 10 minutes
    const otpExpiry = new Date();

    otpExpiry.setMinutes(
      otpExpiry.getMinutes() + 10
    );

    // =================================================
    // OTP EMAIL HTML
    // =================================================

    const emailContent = `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 30px;
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
        "
      >

        <h2 style="color: #2563eb;">
          Verify Your FitFusion Account
        </h2>

        <p>
          Hello <strong>${name}</strong>,
        </p>

        <p>
          Thank you for registering with FitFusion.
          Please use the OTP below to verify your email.
        </p>

        <div
          style="
            margin: 25px 0;
            padding: 20px;
            background-color: #eff6ff;
            border-radius: 10px;
            text-align: center;
          "
        >
          <span
            style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #2563eb;
            "
          >
            ${otp}
          </span>
        </div>

        <p>
          This OTP will expire in <strong>10 minutes</strong>.
        </p>

        <p>
          If you didn't create this account,
          you can safely ignore this email.
        </p>

        <p>
          Best regards,<br />
          <strong>FitFusion Team</strong>
        </p>

      </div>
    `;

    // =================================================
    // SEND OTP USING RESEND
    // =================================================

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: "Your FitFusion Verification OTP",
      html: emailContent,
    });

    if (error) {
      console.error(
        "Resend OTP Error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to send OTP. Please try again.",
      });
    }

    console.log(
      "OTP email sent successfully:",
      data?.id
    );

    // =================================================
    // CREATE USER
    // =================================================

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false,
    });

    res.status(201).json({
      message:
        "OTP sent to your email. Please verify to complete registration.",
      email,
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
    if (
      !user.otpExpiry ||
      new Date() > user.otpExpiry
    ) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    // Verify user
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    // =================================================
    // GENERATE JWT
    // =================================================

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
      message:
        "Email verified successfully",
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
    // RESEND OTP EMAIL
    // =================================================

    const emailContent = `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 30px;
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
        "
      >

        <h2 style="color: #2563eb;">
          Your New FitFusion OTP
        </h2>

        <p>
          Hello <strong>${user.name}</strong>,
        </p>

        <p>
          You requested a new verification OTP.
        </p>

        <div
          style="
            margin: 25px 0;
            padding: 20px;
            background-color: #eff6ff;
            border-radius: 10px;
            text-align: center;
          "
        >
          <span
            style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #2563eb;
            "
          >
            ${otp}
          </span>
        </div>

        <p>
          This OTP will expire in
          <strong>10 minutes</strong>.
        </p>

        <p>
          Best regards,<br />
          <strong>FitFusion Team</strong>
        </p>

      </div>
    `;

    const { data, error } =
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject:
          "Your New FitFusion Verification OTP",
        html: emailContent,
      });

    if (error) {
      console.error(
        "Resend resendOTP Error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to resend OTP. Please try again.",
      });
    }

    console.log(
      "Resend OTP email sent:",
      data?.id
    );

    // Update OTP only after email succeeds
    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();

    res.status(200).json({
      message:
        "New OTP sent to your email",
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
  const {
    email,
    password,
  } = req.body;

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
          message:
            "Email not verified",
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
    }

    return res.status(400).json({
      message: "Invalid credentials",
    });

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
    const user =
      await User.findById(
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
    if (name) {
      user.name = name;
    }

    if (height) {
      user.height = height;
    }

    if (weight) {
      user.weight = weight;
    }

    if (gender) {
      user.gender = gender;
    }

    if (age) {
      user.age = age;
    }

    // =================================================
    // PROFILE IMAGE
    // =================================================

    if (req.file) {
      user.profileImage =
        `/uploads/${req.file.filename.replace(
          /\\/g,
          "/"
        )}`;
    }

    // =================================================
    // PASSWORD
    // =================================================

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

    // Save user
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
      message:
        "Error updating profile",
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
    const mailContent = `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 30px;
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
        "
      >

        <h2 style="color: #2563eb;">
          New Contact Form Message
        </h2>

        <hr />

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
        </p>

        <div
          style="
            padding: 15px;
            background-color: #f9fafb;
            border-radius: 8px;
          "
        >
          ${message}
        </div>

      </div>
    `;

    // =================================================
    // SEND CONTACT EMAIL
    // =================================================

    const { data, error } =
      await resend.emails.send({
        from: FROM_EMAIL,

        // Your receiving email
        to: ["ramkumar070406@gmail.com"],

        subject:
          "New Contact Form Submission",

        html: mailContent,
      });

    if (error) {
      console.error(
        "Resend Contact Error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to send your message. Please try again later.",
      });
    }

    console.log(
      "Contact email sent:",
      data?.id
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