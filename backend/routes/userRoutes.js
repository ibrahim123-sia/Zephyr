const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// Rate limiting for OTP requests (5 requests per 15 minutes)
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 OTP requests per windowMs
  message: "Too many OTP requests from this IP, please try again later",
  skipSuccessfulRequests: true,
});

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// @route   POST /api/users/register
// @desc    Register a new user and send OTP
// @access  Public
router.post("/register", otpLimiter, async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    let user = await User.findOne({ email });

    if (user?.isVerified) {
      return res.status(400).json({
        message: "User already exists. Please login instead.",
      });
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    if (user) {
      user.name = name;
      user.password = password; // This will be hashed by pre-save hook
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    } else {
      user = new User({
        name,
        email,
        password,
        otp,
        otpExpires,
      });
      await user.save();
    }

    try {
      await transporter.sendMail({
        from: `"Zephyr" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your OTP Verification Code",
        html: `
          <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #3A2E27;">
            <h2 style="color: #1B1512; letter-spacing: 1px;">Welcome to Zephyr</h2>
            <p>Hello ${name},</p>
            <p>Your OTP verification code is:</p>
            <div style="background: #F8F3EC; padding: 20px; text-align: center; margin: 20px 0; border: 1px solid #E7DCC9;">
              <h1 style="margin: 0; color: #B48A4A; letter-spacing: 6px; font-size: 28px;">${otp}</h1>
            </div>
            <p>This code will expire in 5 minutes.</p>
            <p style="font-size: 12px; color: #7f8c8d;">
              If you didn't request this code, please ignore this email or contact support.
            </p>
          </div>
        `,
      });

      res.status(200).json({
        success: true,
        message: "OTP sent to your email. Please check your inbox.",
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      await User.deleteOne({ email });
      return res.status(500).json({
        message: "Failed to send OTP email. Please try again.",
      });
    }
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      message: "Server error during registration",
    });
  }
});

// @route   POST /api/users/verify-otp
// @desc    Verify OTP and activate account
// @access  Public
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const cleanOtp = otp?.trim();

  if (!email || !cleanOtp) {
    return res.status(400).json({
      message: "Email and OTP are required",
      received: { email, otp: cleanOtp },
    });
  }

  try {
    const user = await User.findOne({ email }).select("+otp +otpExpires");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Account already verified. Please login.",
      });
    }

    if (!user.otp || user.otp !== cleanOtp) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new one.",
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) {
          console.error("JWT signing error:", err);
          throw err;
        }
        res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
          message: "Account verified successfully!",
        });
      }
    );
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/users/resend-otp
// @desc    Resend OTP to user's email
// @access  Public
router.post("/resend-otp", otpLimiter, async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Account already verified. Please login.",
      });
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    try {
      await transporter.sendMail({
        from: `"Zephyr" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your New OTP Verification Code",
        html: `
          <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #3A2E27;">
            <h2 style="color: #1B1512; letter-spacing: 1px;">New OTP Requested</h2>
            <p>Hello ${user.name},</p>
            <p>Your new OTP verification code is:</p>
            <div style="background: #F8F3EC; padding: 20px; text-align: center; margin: 20px 0; border: 1px solid #E7DCC9;">
              <h1 style="margin: 0; color: #B48A4A; letter-spacing: 6px; font-size: 28px;">${otp}</h1>
            </div>
            <p>This code will expire in 5 minutes.</p>
            <p style="font-size: 12px; color: #7f8c8d;">
              If you didn't request this code, please ignore this email or contact support.
            </p>
          </div>
        `,
      });

      res.status(200).json({
        success: true,
        message: "New OTP sent to your email. Please check your inbox.",
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return res.status(500).json({
        message: "Failed to send OTP email. Please try again.",
      });
    }
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({
      message: "Server error while resending OTP",
    });
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Account not verified. Please verify your email first.",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// @route   GET /api/users/profile
// @desc    Get logged-in user's profile
// @access  Private
router.get("/profile", protect, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
});

// @route   POST /api/users/forgot-password
// @desc    Send OTP for password reset
// @access  Public
router.post("/forgot-password", otpLimiter, async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({
        success: true,
        message: "If an account exists, an OTP has been sent to your email",
      });
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = otpExpires;
    await user.save();

    await transporter.sendMail({
      from: `"Zephyr" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #3A2E27;">
          <h2 style="color: #1B1512; letter-spacing: 1px;">Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>Your OTP for password reset is:</p>
          <div style="background: #F8F3EC; padding: 20px; text-align: center; margin: 20px 0; border: 1px solid #E7DCC9;">
            <h1 style="margin: 0; color: #B48A4A; letter-spacing: 6px; font-size: 28px;">${otp}</h1>
          </div>
          <p>This code will expire in 5 minutes.</p>
          <p style="font-size: 12px; color: #7f8c8d;">
            If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
    });

    res.json({
      success: true,
      message: "OTP has been sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/users/reset-password
// @desc    Reset password with OTP
// @access  Public
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const user = await User.findOne({ email }).select(
      "+resetPasswordOtp +resetPasswordExpires"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.resetPasswordOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
