import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const ForgetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [forgetPasswordForm, setForgetPasswordForm] = useState(true);
  const [newPassword, setNewPassword] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [resendOtp, setResendOtp] = useState(false);
  const navigate = useNavigate();

  const serverURL = import.meta.env.VITE_SERVER_URL;

  const sendOtp = async () => {
    try {
      const result = await axios.post(
        serverURL + "/api/reset/sendotp",
        { email },
        { withCredentials: true },
      );
      console.log(result);
      if (result) {
        toast.success("OTP sent to your email.");
      }
    } catch (error) {
      console.log("send otp error:", error);
      toast.error(error.response.data);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    try {
      if (otp === "") {
        toast("Enter the OTP first.");
      }
      if (otp !== "") {
        const result = await axios.post(
          serverURL + "/api/reset/verifyotp",
          { email, otp },
          { withCredentials: true },
        );
        console.log(result);
        if (result) {
          setConfirm(true);
          setNewPassword(false);
        }
      }
    } catch (error) {
      console.log("verifyOTP error:", error);
      toast.error(error.response.data);
      setOtp("");
      setResendOtp(true); // OTP expire / invalid
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      if (password !== checkPassword) {
        toast.error("⚠️ Confirm password does not match the new password");
        setCheckPassword("");
      }
      if (password === checkPassword) {
        const result = await axios.post(
          serverURL + "/api/reset/resetpassword",
          { email, password },
          { withCredentials: true },
        );
        if (result) {
          navigate("/");
        }
        toast.success("Password reset successfully.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  return (
    <div className="h-screen relative w-full flex bg-[#F6F5F8] text-black">
      <img src="/auth.png" alt="" className="h-screen w-full object-cover" />
      {/* LEFT SIDE */}
      <div className="h-full absolute z-50 bg-black/50 backdrop-blur-[5px]  w-full flex items-center flex-col justify-center">
        {/* Logo */}
        <h2 className="font-Nunito fixed top-6 left-6 text-4xl text-[#F6F5F8]">
          Learn
          <span className="text-[#A4FE6A] font-bold text-[2.5rem]">Z</span>y
        </h2>

        {/* FORM 1 */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className={`lg:w-[90%] ${
            forgetPasswordForm ? "block" : "hidden"
          } bg-white/20 w-[95%] cursord max-w-[28rem] text-[#F6F5F8] h-auto p-6 flex flex-col gap-4 items-center rounded-2xl`}
        >
          <h2 className="text-3xl font-Nunito">Enter Your Registered Email</h2>
          <p className="text-sm">
            Provide the email address accociated to your account to recover your
            password.{" "}
          </p>
          {/* Email */}
          <div className="flex items-center gap-2 w-full bg-slate-200 text-black rounded-lg p-2">
            <MdEmail className="text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent w-full outline-none"
            />
          </div>

          {/* OTP Button */}
          <button
            onClick={() => {
              sendOtp();
              setForgetPasswordForm(false);
              setNewPassword(true);
            }}
            disabled={!email}
            className="w-full bg-[#2A27F3] text-white font-semibold py-2 rounded-lg hover:bg-[#3334FE]"
          >
            Send Email
          </button>
        </form>

        {/* FORM 2 */}
        <form
          onSubmit={verifyOTP}
          className={`lg:w-[90%] ${
            newPassword ? "block" : "hidden"
          } bg-white/20 w-[95%] cursord max-w-[28rem] text-[#F6F5F8] h-auto p-6 flex flex-col gap-4 items-center rounded-2xl `}
        >
          <h2 className="text-3xl font-Nunito">Enter your OTP</h2>
          {/* Email */}
          <div className="flex items-center gap-2 w-full bg-slate-200 text-black rounded-lg p-2">
            <MdEmail className="text-gray-400" />
            <input
              type="text"
              placeholder="OTP"
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              className="bg-transparent w-full outline-none"
            />
          </div>
          <p>check your Email for the OTP.</p>

          {/* OTP Button */}
          <button
            type="submit"
            className="w-full bg-[#2A27F3] text-white font-semibold py-2 rounded-lg hover:bg-[#3334FE]"
          >
            change password
          </button>

          <button
            type="button"
            disabled={!resendOtp}
            onClick={sendOtp}
            className={`w-full text-white font-semibold py-2 rounded-lg 
    ${resendOtp ? "bg-[#2A27F3] hover:bg-[#3334FE]" : "bg-gray-400 cursor-not-allowed"}`}
          >
            Resend OTP
          </button>
        </form>

        {/* FORM 3 */}
        <form
          onSubmit={resetPassword}
          className={`lg:w-[90%] ${
            confirm ? "block" : "hidden"
          } bg-white/20 w-[95%] cursord max-w-[28rem] text-[#F6F5F8] h-auto p-6 flex flex-col gap-4 items-center rounded-2xl `}
        >
          <h2 className="text-3xl font-Nunito">Reset Password</h2>
          {/* PASSWORD */}
          <div className="flex items-center gap-2 w-full bg-slate-200 text-black rounded-lg p-2">
            <FaLock className="text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent w-full outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
              className="text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="w-full items-center">
            <p className="text-gray-200 text-sm">
              Minimum length is 8 characters.
            </p>
          </div>

          {/* confirm password */}
          <div className="flex items-center gap-2 w-full bg-slate-200 text-black rounded-lg p-2">
            <FaLock className="text-gray-400" />
            <input
              type={confirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={(e) => setCheckPassword(e.target.value)}
              value={checkPassword}
              className="bg-transparent w-full outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setConfirmPassword(!confirmPassword);
              }}
              className="text-gray-400"
            >
              {confirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* OTP Button */}
          <button
            type="submit"
            className="w-full bg-[#2A27F3] text-white font-semibold py-2 rounded-lg hover:bg-[#3334FE]"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
