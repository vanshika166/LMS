import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appDataContext } from "../Context/AppContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setUserData } from "../redux/userSlice.js";

const UserProfile = () => {
  const { serverURL } = useContext(appDataContext);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const user = useSelector((state) => state.user.userData);
  const mode = useSelector((state) => state.app.mode);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleDashboard = () => {
    if (user?.role === "student") {
      navigate("/student/dashboard");
    } else {
      navigate("/teacher/dashboard");
    }
  };
  const handleLogout = async () => {
    try {
      const result = await axios.get(serverURL + "/api/auth/logout", {
        withCredentials: true,
      });
      console.log(result.data);
      if (result) {
        navigate("/");
        dispatch(setUserData(null))
        toast.success(result.data.message);
      }
    } catch (error) {
      console.log("logout error:", error);
    }
  };

  return (
    <div className="relative">
      <div
        onClick={() => setShowProfileMenu(!showProfileMenu)}
        className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-1.5 px-3 rounded-full cursor-pointer transition-all duration-300"
      >
        <div className="h-9 w-9 flex items-center justify-center overflow-hidden rounded-full">
          {user?.photoURL?.url ? (
            <img
              src={user.photoURL.url}
              alt="profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full text-white flex items-center justify-center font-bold">
              <img src="/profile.jpg" alt="" className="object-cover h-full w-full" />
            </div>
          )}
        </div>
        <span className={`text-sm font-medium hidden ${mode?"text-white":"text-black"} md:block`}>
          {user?.username?.split(" ")[0] ||
            user?.email?.split("@")[0] ||
            "User"}
        </span>
      </div>

      {showProfileMenu && (
        <div
          className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-2 transition-colors duration-300 
      ${mode ? "bg-[#1F2024]  text-gray-100" : "bg-white  text-gray-800"}`}
        >
          {/* User Info */}
          <div
            className={`px-4 py-2 border-b 
        ${mode ? "border-gray-700" : "border-gray-200"}`}
          >
            <p className="text-sm font-semibold">
              {user?.username || user?.email?.split("@")[0]}
            </p>
            <p
              className={`text-xs capitalize ${
                mode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {user?.role || "student"}
            </p>
          </div>

          {/* Dashboard Button */}
          <button
            onClick={() => handleDashboard()}
            className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150
        ${
          mode
            ? "hover:bg-gray-700 hover:text-white"
            : "hover:bg-gray-100 text-gray-800"
        }`}
          >
            Dashboard
          </button>

          {/* Logout Button */}
          <button
            onClick={()=>handleLogout()}
            className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150
        ${
          mode
            ? "text-red-400 hover:bg-gray-700 hover:text-red-300"
            : "text-red-500 hover:bg-gray-100 hover:text-red-600"
        }`}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
