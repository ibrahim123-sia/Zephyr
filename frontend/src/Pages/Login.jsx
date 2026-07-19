import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import login from "../assets/login.jpg";
import { toast } from "react-toastify";
import {
  loginUser,
  forgotPassword,
  resetPassword,
} from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetStep, setResetStep] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId, loading, error } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(redirect);
        });
      } else {
        navigate(redirect);
      }
    }
  }, [user, guestId, cart, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(forgotPassword(resetEmail));
      if (forgotPassword.fulfilled.match(result)) {
        setResetStep(2);
        toast.success("OTP has been sent to your email");
      }
    } catch (err) {
      toast.error(err.message || "Failed to send OTP");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetOtp || !newPassword || !confirmPassword) {
      toast.info("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.info("Passwords don't match!");
      return;
    }
    try {
      const result = await dispatch(
        resetPassword({ email: resetEmail, otp: resetOtp, newPassword })
      );
      if (resetPassword.fulfilled.match(result)) {
        toast.success("Password reset successfully!");
        setResetStep(0);
        setResetOtp("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error(error.message || "Password reset failed. Please try again.");
    }
  };

  const formWrapper = "w-full max-w-md bg-white p-8 rounded-sm shadow-sm border border-zephyr-sand";
  const inputClass = "w-full p-3 border border-zephyr-sand rounded-sm focus:outline-none focus:ring-1 focus:ring-zephyr-gold focus:border-zephyr-gold transition duration-200 bg-zephyr-ivory";
  const buttonPrimary = "w-full bg-zephyr-noir hover:bg-zephyr-gold text-zephyr-ivory p-3 rounded-sm font-medium uppercase text-sm tracking-widest transition duration-200";
  const linkBtn = "mt-4 text-zephyr-gold hover:text-zephyr-umber transition text-sm";

  return (
    <div className="flex min-h-screen bg-zephyr-ivory">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12">
        {resetStep === 0 ? (
          <form onSubmit={handleLogin} className={formWrapper}>
            <h2 className="font-display text-3xl text-center mb-6 text-zephyr-noir">Welcome Back</h2>
            {error && <div className="text-red-600 mb-4 text-sm p-2 bg-red-50 rounded-sm">{error}</div>}
            <div className="mb-5">
              <label className="block text-sm font-medium mb-2 text-zephyr-umber">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-zephyr-umber">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className={buttonPrimary} disabled={loading}>
              {loading ? "Processing..." : "Login"}
            </button>
            <button type="button" onClick={() => setResetStep(1)} className={linkBtn}>
              Forgot Password?
            </button>
            <p className="mt-6 text-center text-sm text-zephyr-umber/70">
              Don't have an account?{" "}
              <Link
                to={`/register?redirect=${encodeURIComponent(redirect)}`}
                className="text-zephyr-gold hover:underline font-medium"
              >
                Create account
              </Link>
            </p>
          </form>
        ) : resetStep === 1 ? (
          <form onSubmit={handleSendOtp} className={formWrapper}>
            <h2 className="font-display text-3xl text-center mb-6 text-zephyr-noir">Reset Password</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-zephyr-umber">Email</label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className={inputClass}
                placeholder="Enter your email"
                required
              />
            </div>
            <button type="submit" className={buttonPrimary} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
            <button type="button" onClick={() => setResetStep(0)} className={linkBtn}>
              Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className={formWrapper}>
            <h2 className="font-display text-3xl text-center mb-6 text-zephyr-noir">Reset Password</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-zephyr-umber">OTP</label>
              <input
                type="text"
                value={resetOtp}
                onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                className={inputClass}
                placeholder="Enter 6-digit OTP"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-zephyr-umber">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
                placeholder="Enter new password"
                required
                minLength={6}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-zephyr-umber">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
                placeholder="Confirm new password"
                required
                minLength={6}
              />
            </div>
            <button type="submit" className={buttonPrimary} disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
      <div className="hidden md:block w-1/2 relative overflow-hidden">
        <img src={login} alt="Zephyr" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-zephyr-noir/80 to-zephyr-noir/10"></div>
        <div className="absolute bottom-10 left-10 text-zephyr-ivory">
          <h1 className="font-display text-4xl mb-2">Welcome</h1>
          <p className="text-lg opacity-90">Sign in to access your Zephyr account</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
