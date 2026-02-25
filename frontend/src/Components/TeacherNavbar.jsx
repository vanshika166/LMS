import React, { useState, useContext, useEffect } from "react";
import { FiLogOut, FiBell, FiMenu } from "react-icons/fi";
import { IoMdHome } from "react-icons/io";
import { MdNightlight } from "react-icons/md";
import { FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setmode } from "../redux/appSlice.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { appDataContext } from "../Context/AppContext.jsx";
import { toast } from "react-toastify";
import { setUserData } from "../redux/userSlice.js";

const TeacherNavbar = ({ handlesmall }) => {
  const dispatch = useDispatch();
  const {count,getCount} = useContext(appDataContext)
  const { serverURL } = useContext(appDataContext);
  const [openMenu, setOpenMenu] = useState(false);
  const mode = useSelector((state) => state.app.mode);
  const user = useSelector((state) => state.user.userData);
  const navigate = useNavigate();

  useEffect(() => {
    getCount()
  }, [])
  

  const handleLogout = async () => {
    try {
      const result = await axios.get(serverURL + "/api/auth/logout", {
        withCredentials: true,
      });
      navigate("/");
      dispatch(setUserData(null))
      toast.success(result.data.message);
    } catch (error) {
      console.log("logout error:", error);
    }
  };



  return (
    <nav
      className={`w-full h-16 flex items-center justify-between px-6 transition-colors duration-300 ${
        mode ? "bg-black text-white" : "bg-[#F6F5F8] text-gray-800"
      }`}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button onClick={handlesmall} className="text-2xl lg:hidden block">
          <FiMenu />
        </button>

        <div className="hidden md:block text-sm font-semibold">
          Welcome, {user?.name || "Teacher"} 👋
        </div>
      </div>

      {/* Right Section - Proper Order */}
      <div className="flex items-center gap-5">
        {/* 1️⃣ Mode Toggle */}
        <div
          onClick={() => dispatch(setmode())}
          className={`p-2 rounded-sm cursor-pointer transition ${
            mode ? "hover:bg-[#1F2024]" : "hover:bg-black/10"
          }`}
        >
          {mode ? <FaSun className="text-[#2A27F3]" /> : <MdNightlight />}
        </div>

        {/* 2️⃣ Notifications */}
        <div
          onClick={() => navigate("/teacher/educator-notification")}
          className={`p-2 rounded-sm transition relative cursor-pointer ${mode ? "hover:bg-[#1F2024]" : "hover:bg-black/10"}`}
        >
          <FiBell size={20} />
          {count > 0  && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
              {count}
            </span>
          )}
        </div>

        {/* 3️⃣ New Course (Primary Action) */}
        <button
          onClick={() => navigate("/teacher/create-course")}
          className="bg-[#2A27F3] hidden lg:block font-semibold text-white hover:bg-[#0c09b5] transition-all duration-300 px-5 py-2 rounded-md"
        >
          + New Course
        </button>

        {/* 4️⃣ Profile (Always Last) */}
        <div className="relative">
          <div
            onClick={() => setOpenMenu(!openMenu)}
            className="h-10 w-10 overflow-hidden rounded-full cursor-pointer"
          >
            {user?.photoURL?.url ? (
              <img
                src={user.photoURL.url}
                alt="profile"
                className="object-cover h-full w-full"
              />
            ) : (
              <img
                src="/profile.jpg"
                alt="profile"
                className="object-cover h-full w-full"
              />
            )}
          </div>

          {openMenu && (
            <div
              className={`absolute right-0 mt-2 w-44 rounded-lg shadow-lg overflow-hidden z-50 ${
                mode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              }`}
            >
              <button
                onClick={() => navigate("/")}
                className="w-full px-4 py-2 flex items-center gap-2 hover:bg-blue-200 hover:text-black transition text-sm"
              >
                <IoMdHome size={16} /> Home
              </button>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 flex items-center gap-2 hover:bg-red-100 text-red-600 transition text-sm"
              >
                <FiLogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TeacherNavbar;
