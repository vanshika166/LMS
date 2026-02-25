import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaGoogle, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from 'axios'
import { toast } from "react-toastify";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase.js";
import {useDispatch} from 'react-redux'
import { getCurrentUser } from "../redux/actions/userActions.js";

const AuthPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [login, setLogin] = useState(false);
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const serverURL = "http://localhost:5000"

  const handleLogin = () => {
    setLogin(!login);
  };

  useEffect(() => {
    if (location.pathname === "/login") {
      setLogin(true);
    }
  }, [location.pathname]);


  const handleSignUpUser = async()=>{
    try {
      const result = await axios.post(serverURL+"/api/auth/signup",{username,email,password,role},{withCredentials:true})
      toast.success("Signup successfully!")
      if(result.data){
        setUsername("")
        setEmail("")
        setPassword("")
        setRole("student")
      }
      navigate("/")
      dispatch(getCurrentUser())
    } catch (error) {
      console.log(error)
        toast.error(error.response.data.error)
    }
  }

  const handleLoginUser = async()=>{
    try {
      const result = await axios.post(serverURL+"/api/auth/login",{email,password},{withCredentials:true})
      toast.success(result.data.message)
      if(result){
        setEmail("")
        setPassword("")
      }
      navigate("/")
      dispatch(getCurrentUser())
      disp
    } catch (error) {
      console.log(error)
        toast.error(error.response.data.message)
    }
  }

  const handleGoogleAuthetication = async()=>{
    try {
      const response = await signInWithPopup(auth,provider)
      const user = response.user;
      const username = user.displayName;
      const email = user.email
    
      const result = await axios.post(serverURL+"/api/auth/googleauth",{username,email,role},{withCredentials:true})
      navigate("/")
      toast.success("Logged in successfully.")
      dispatch(getCurrentUser())
      
    } catch (error) {
      console.log("google authentication error:",error)
    }
  }



  return (
    <div className="h-screen relative w-full flex bg-[#F6F5F8] text-black">
        <img src="/auth.png" alt="" className="h-screen w-full object-cover" />
      {/* LEFT SIDE */}
      <div className="h-full absolute z-50 bg-black/50 backdrop-blur-[5px]  w-full flex items-center flex-col justify-center">
        {/* Logo */}
        <h2 className="font-Nunito fixed top-6 left-6 text-4xl text-[#F6F5F8]">
          Learn
          <span className="text-[#A4FE6A] font-bold text-[1.5rem]">Z</span>y
        </h2>

        {/* FORM */}
        <form onSubmit={(e)=>e.preventDefault()} className="lg:w-[90%] bg-white/20 md:w-full w-[95%] cursord max-w-[28rem] text-[#F6F5F8] h-auto p-6 flex flex-col gap-4 items-center rounded-2xl ">
          <h2 className="lg:text-4xl text-2xl font-Nunito font-semibold mb-2">
            {login ? "Login to your account" : "Create new account"}
          </h2>

          {/* Register With */}
          <div className="flex w-full gap-2">
            <button
            onClick={handleGoogleAuthetication}
            className="flex-1  flex items-center justify-center gap-2 bg-[#2A27F3] text-white hover:bg-[#3334FE] rounded-lg p-2 text-md">
              <FaGoogle /> Google
            </button>
          </div>

          <div className="w-full flex items-center justify-between">
            <div className="h-[0.025rem] w-[44%] bg-gray-300"></div>
          <p className="text-gray-200 text-sm">Or</p>
            <div className="h-[0.025rem] w-[44%] bg-gray-300"></div>
          </div>



          {/* Username */}
          {!login && (
            <div className="flex items-center gap-2 w-full bg-slate-200 text-black rounded-lg p-2">
              <FaUser className="text-gray-400" />
              <input
                type="text"
                onChange={(e)=>setUsername(e.target.value)}
                value={username}
                placeholder="Fullname"
                className="bg-transparent w-full outline-none"
              />
            </div>
          )}

          {/* Email */}
          <div className="flex items-center gap-2 w-full bg-slate-200 text-black rounded-lg p-2">
            <MdEmail className="text-gray-400" />
            <input
              type="email"
              onChange={(e)=>setEmail(e.target.value)}
              value={email}
              placeholder="Email"
              className="bg-transparent w-full outline-none"
            />
          </div>

          {/* Password with toggle */}
          <div className="flex items-center gap-2 w-full bg-slate-200 text-black rounded-lg p-2">
            <FaLock className="text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e)=>setPassword(e.target.value)}
              value={password}
              className="bg-transparent w-full outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/*password forget  */}
          <div className="w-full flex justify-between items-center px-2">
            <p className="text-gray-200 lg:text-xs text-[10px]">Minimum length is 8 characters.</p>
            <p onClick={()=>navigate("/forget-password")} className={`text-gray-200 lg:text-xs text-[10px] cursor-pointer hover:underline`}>Forget your password?</p>
          </div>

          {/* Role Selection */}
          {!login && (
            <div className="flex items-center justify-between p-2 w-full gap-2">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex-1 rounded-lg py-2 ${
                  role === "student"
                    ? "bg-[#2A27F3] text-white font-semibold"
                    : "bg-slate-200 text-black transition-all duration-300"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("educator")}
                className={`flex-1 rounded-lg py-2 ${
                  role === "educator"
                    ? "bg-[#2A27F3] text-white font-semibold"
                    : "bg-slate-200 text-black transition-all duration-300"
                }`}
              >
                Educator
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
          onClick={()=>{login?handleLoginUser():handleSignUpUser()}}
          className="w-full bg-[#2A27F3] text-white font-semibold py-2 rounded-lg hover:bg-[#3334FE]">
            {login ? "Login" : "Sign Up"}
          </button>

          {/* Toggle Login/Signup */}
          <p className="text-sm text-gray-200 mt-2">
            {login ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              onClick={handleLogin}
              className="text-[#F6F5F8] cursor-pointer hover:underline hover:text-gray-300"
            >
              {login ? "Sign Up" : "Login"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
