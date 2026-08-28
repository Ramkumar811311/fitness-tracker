const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// =====================================================
// EMAIL TRANSPORTER - IMPROVED
// =====================================================


// Verify transporter connection on startup

// =====================================================
// GENERATE OTP
// =====================================================

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// =====================================================
// BREVO EMAIL API
// =====================================================

const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is missing");
    }

    if (!process.env.BREVO_FROM_EMAIL) {
      throw new Error("BREVO_FROM_EMAIL is missing");
    }

    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",

        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },

        body: JSON.stringify({
          sender: {
            name: process.env.BREVO_FROM_NAME || "FitFusion",
            email: process.env.BREVO_FROM_EMAIL,
          },

          to: [
            {
              email: to,
            },
          ],

          subject: subject,

          htmlContent: html,
        }),
      }
    );

    const responseText = await response.text();

    let result = {};

    try {
      result = responseText
        ? JSON.parse(responseText)
        : {};
    } catch {
      result = {
        raw: responseText,
      };
    }

    if (!response.ok) {
      console.error("Brevo API Error:", result);

      return {
        success: false,
        error:
          result?.message ||
          responseText ||
          `HTTP ${response.status}`,
      };
    }

    console.log(
      "Brevo email sent successfully:",
      result.messageId
    );

    return {
      success: true,
      info: result,
    };
  } catch (error) {
    console.error(
      "Brevo email sending failed:",
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

// =====================================================
// REGISTER USER - IMPROVED
// =====================================================

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, email and password",
    });
  }

  try {
    // Check if verified user already exists
    const userExists = await User.findOne({
      email: email.toLowerCase(),
      isVerified: true,
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Check if unverified user exists
    const userNotVerified = await User.findOne({
      email: email.toLowerCase(),
      isVerified: false,
    });

    // Delete old unverified account
    if (userNotVerified) {
      await userNotVerified.deleteOne();
      console.log("Deleted unverified user:", email);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log(`Generated OTP for ${email}: ${otp}`); // Only for debugging

    // =================================================
    // OTP EMAIL CONTENT
    // =================================================

    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <tr>
                  <td style="text-align: center;">
                    <h1 style="color: #2c3e50; font-size: 28px; margin-bottom: 10px;">🏋️ FitFusion</h1>
                    <h2 style="color: #34495e; font-size: 22px; margin-bottom: 30px;">Email Verification</h2>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="color: #333; font-size: 16px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
                    <p style="color: #333; font-size: 16px; line-height: 1.6;">Thank you for registering with FitFusion. Please use the following OTP to verify your email address:</p>
                    
                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; border: 2px dashed #3498db;">
                      <span style="font-size: 36px; font-weight: bold; color: #2c3e50; letter-spacing: 8px;">${otp}</span>
                    </div>
                    
                    <p style="color: #666; font-size: 14px; text-align: center;">This OTP is valid for <strong>10 minutes</strong></p>
                    
                    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                      <p style="color: #856404; font-size: 14px; margin: 0;">⚠️ If you didn't request this, please ignore this email.</p>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    
                    <p style="color: #666; font-size: 14px; line-height: 1.6;">
                      Best regards,<br>
                      <strong>The FitFusion Team</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // =================================================
    // SEND EMAIL
    // =================================================

    const emailResult = await sendEmail(
      email,
      "🔐 Verify Your FitFusion Account",
      emailContent
    );

    if (!emailResult.success) {
      console.error("Failed to send OTP email:", emailResult.error);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please check your email configuration.",
        error: process.env.NODE_ENV === "development" ? emailResult.error : undefined,
      });
    }

    // =================================================
    // CREATE USER AFTER EMAIL SUCCESS
    // =================================================

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      otp: otp,
      otpExpiry: otpExpiry,
      isVerified: false,
    });

    console.log(`User registered successfully: ${email}`);

    res.status(201).json({
      success: true,
      message: "OTP sent to your email. Please verify to complete registration.",
      email: email,
    });

  } catch (error) {
    console.error("Error registering user:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to register user. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// =====================================================
// VERIFY OTP - IMPROVED
// =====================================================

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and OTP",
    });
  }

  try {
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    // Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check expiry
    if (Date.now() > user.otpExpiry.getTime()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
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
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    console.log(`User verified successfully: ${email}`);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || null,
      }
    });

  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// =====================================================
// RESEND OTP - IMPROVED
// =====================================================

const resendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please provide email",
    });
  }

  try {
    // Find unverified user
    const user = await User.findOne({
      email: email.toLowerCase(),
      isVerified: false,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or already verified",
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    console.log(`New OTP for ${email}: ${otp}`); // Only for debugging

    // =================================================
    // RESEND EMAIL CONTENT
    // =================================================

    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <tr>
                  <td style="text-align: center;">
                    <h1 style="color: #2c3e50; font-size: 28px; margin-bottom: 10px;">🏋️ FitFusion</h1>
                    <h2 style="color: #34495e; font-size: 22px; margin-bottom: 30px;">New OTP Request</h2>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="color: #333; font-size: 16px; line-height: 1.6;">Hello <strong>${user.name}</strong>,</p>
                    <p style="color: #333; font-size: 16px; line-height: 1.6;">You requested a new OTP. Please use the following code to verify your account:</p>
                    
                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; border: 2px dashed #3498db;">
                      <span style="font-size: 36px; font-weight: bold; color: #2c3e50; letter-spacing: 8px;">${otp}</span>
                    </div>
                    
                    <p style="color: #666; font-size: 14px; text-align: center;">This OTP is valid for <strong>10 minutes</strong></p>
                    
                    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                      <p style="color: #856404; font-size: 14px; margin: 0;">⚠️ If you didn't request this, please ignore this email.</p>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    
                    <p style="color: #666; font-size: 14px; line-height: 1.6;">
                      Best regards,<br>
                      <strong>The FitFusion Team</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // =================================================
    // SEND EMAIL
    // =================================================

    const emailResult = await sendEmail(
      email,
      "🔄 New OTP for FitFusion",
      emailContent
    );

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again.",
      });
    }

    // Update OTP
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    res.status(200).json({
      success: true,
      message: "New OTP sent to your email",
    });

  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend OTP. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// =====================================================
// LOGIN USER - IMPROVED
// =====================================================

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  try {
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Email not verified. Please verify your email first.",
        requiresVerification: true,
        email: user.email,
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || null,
        height: user.height || null,
        weight: user.weight || null,
        gender: user.gender || null,
        age: user.age || null,
      }
    });

  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// =====================================================
// GET USER BY ID - IMPROVED
// =====================================================

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -otp -otpExpiry");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: user,
    });

  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// =====================================================
// UPDATE PROFILE - IMPROVED
// =====================================================

const updateProfile = async (req, res) => {
  try {
    const { email, name, password, height, weight, gender, age } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields only if provided
    if (name) user.name = name.trim();
    if (height) user.height = height;
    if (weight) user.weight = weight;
    if (gender) user.gender = gender;
    if (age) user.age = age;

    // Update profile image
    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename.replace(/\\/g, "/")}`;
    }

    // Update password if provided
    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    // Save
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage || null,
        height: updatedUser.height || null,
        weight: updatedUser.weight || null,
        gender: updatedUser.gender || null,
        age: updatedUser.age || null,
      }
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// =====================================================
// CONTACT US - IMPROVED
// =====================================================

const contactUs = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, email and message",
    });
  }

  try {
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px;">📩 New Contact Form Submission</h2>
          
          <div style="margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px;">
              ${message}
            </div>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">This message was sent from the FitFusion contact form.</p>
        </div>
      </body>
      </html>
    `;

    const emailResult = await sendEmail(
      "ramkumar070406@gmail.com",
      `New Contact Form Submission from ${name}`,
      emailContent
    );

    if (!emailResult.success) {
      console.error(
        "Contact form email failed:",
        emailResult.error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to send your message. Please try again later.",
        error:
          process.env.NODE_ENV === "development"
            ? emailResult.error
            : undefined,
      });
    }

    

    res.status(200).json({
      success: true,
      message: "Your message has been sent successfully!",
    });

  } catch (error) {
    console.error("Error sending contact form email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send your message. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
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