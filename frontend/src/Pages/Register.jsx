import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import registerImg from "../assets/register.jpg";
import { registerUser, verifyOtp, resetOtpState } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { guestId, loading, otpSent, error } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  const formWrapper = "w-full max-w-md bg-white p-8 rounded-sm shadow-sm border border-zephyr-sand";
  const inputClass = "w-full p-3 border border-zephyr-sand rounded-sm focus:outline-none focus:ring-1 focus:ring-zephyr-gold focus:border-zephyr-gold transition duration-200 bg-zephyr-ivory";
  const buttonPrimary = "w-full bg-zephyr-noir hover:bg-zephyr-gold text-zephyr-ivory p-3 rounded-sm font-medium uppercase text-sm tracking-widest transition duration-200";
  const linkBtn = "text-zephyr-gold hover:text-zephyr-umber transition text-sm";

  useEffect(() => {
    let timer;
    if (resendDisabled && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else if (resendTimer === 0) {
      setResendDisabled(false);
      setResendTimer(30);
    }
    return () => clearTimeout(timer);
  }, [resendDisabled, resendTimer]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }))
      .unwrap()
      .then(() => {
        toast.success("OTP sent to your email!");
        setResendDisabled(true);
      })
      .catch((err) => {
        toast.error(err.message || "Failed to send OTP");
      });
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await dispatch(verifyOtp({ email, otp })).unwrap();

      await new Promise((resolve) => setTimeout(resolve, 100));

      const token = localStorage.getItem("userToken");
      if (!token) {
        toast.error("Authentication failed. Please try again.");
        return;
      }

      if (cart?.products.length > 0 && guestId) {
        await dispatch(mergeCart({ guestId })).unwrap();
      }

      toast.success("Account created successfully!");
      navigate(isCheckoutRedirect ? "/checkout" : "/");
    } catch (error) {
      toast.error(error.message || "OTP verification failed");
    }
  };

  const handleResendOtp = () => {
    dispatch(registerUser({ name, email, password }))
      .unwrap()
      .then(() => {
        toast.success("New OTP sent to your email!");
        setResendDisabled(true);
        setResendTimer(30);
      })
      .catch((err) => {
        toast.error(err.message || "Failed to resend OTP");
      });
  };

  const handleResetOtpState = () => {
    dispatch(resetOtpState());
    toast.info("You can now register again");
  };

  return (
    <div className="flex min-h-screen bg-zephyr-ivory">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12">
        {!otpSent ? (
          <form onSubmit={handleRegister} className={formWrapper}>
            <h2 className="font-display text-3xl text-center mb-6 text-zephyr-noir">Create Account</h2>
            <div className="mb-5">
              <label className="block text-sm font-medium mb-2 text-zephyr-umber">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Enter your full name"
                required
              />
            </div>
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
                placeholder="Create a password (min 6 characters)"
                minLength="6"
                required
              />
            </div>
            <button type="submit" className={buttonPrimary} disabled={loading}>
              {loading ? "Processing..." : "Sign Up"}
            </button>
            <p className="mt-6 text-center text-sm text-zephyr-umber/70">
              Already have an account?{" "}
              <Link
                to={`/login?redirect=${encodeURIComponent(redirect)}`}
                className="text-zephyr-gold hover:underline font-medium"
              >
                Login here
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className={formWrapper}>
            <h2 className="font-display text-3xl text-center mb-6 text-zephyr-noir">Verify Email</h2>
            <p className="mb-5 text-center text-sm text-zephyr-umber/70">
              We sent a 6-digit code to <span className="font-medium text-zephyr-gold">{email}</span>
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-zephyr-umber">Verification Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,6}$/.test(value)) {
                    setOtp(value);
                  }
                }}
                maxLength={6}
                className={inputClass}
                placeholder="Enter 6-digit code"
                autoFocus
                required
              />
            </div>
            <button type="submit" className={buttonPrimary} disabled={loading}>
              {loading ? "Verifying..." : "Verify Account"}
            </button>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendDisabled}
                className={`text-sm ${resendDisabled ? "text-zephyr-umber/40" : "text-zephyr-gold hover:underline font-medium"}`}
              >
                {resendDisabled ? `Resend code in ${resendTimer}s` : "Resend verification code"}
              </button>
            </div>
            <button
              type="button"
              onClick={handleResetOtpState}
              className="mt-4 text-sm text-zephyr-umber/60 hover:text-zephyr-umber hover:underline w-full text-center"
            >
              Use a different email
            </button>
          </form>
        )}
      </div>
      <div className="hidden md:block w-1/2 relative overflow-hidden">
        <img src={registerImg} alt="Zephyr" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-zephyr-noir/80 to-zephyr-noir/10"></div>
        <div className="absolute bottom-10 left-10 text-zephyr-ivory">
          <h1 className="font-display text-4xl mb-2">Join Zephyr</h1>
          <p className="text-lg opacity-90">Create an account to unlock exclusive fragrances</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
