import { useContext, useState } from "react";
import {FiLogOut,FiSearch} from "react-icons/fi";
import { MdNightlight } from "react-icons/md";
import { FaSun } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setmode } from "../redux/appSlice.js";
import { FiMenu } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { appDataContext } from "../Context/AppContext.jsx";
import { setUserData } from "../redux/userSlice.js";

const StudentNav = ({handlesmall}) => {
  const {serverURL} = useContext(appDataContext)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [openProfile, setOpenProfile] = useState(false);
  const mode = useSelector((state) => state.app.mode);
    const user = useSelector((state) => state.user.userData);
  const location = useLocation();

  // Get current page name
  const pageName =
    location.pathname === "/"
      ? "Dashboard"
      : location.pathname
          .slice(1)
          .replace("-", " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

          const handleLogout = async () => {
              try {
                const result = await axios.get(serverURL + "/api/auth/logout", {
                  withCredentials: true,
                });
                if (result) {
                  dispatch(setUserData(null));
                  navigate("/");
                  toast.success("Logout successfully.");
                }
              } catch (error) {
                console.log(error);
              }
            };

  return (
    <header
      className={`w-full h-16 flex items-center justify-between px-4 lg:px-8  sticky top-0 z-50 transition-colors duration-300 ${
        mode ? "bg-black text-white" : "bg-[#F6F5F8] text-gray-800"
      }`}
    >
      {/* Left - Page Title */}
      <h1 className="text-xl hidden lg:block font-semibold tracking-wide">{pageName}</h1>
      <button onClick={handlesmall} className="ml-4 text-2xl lg:hidden block"><FiMenu /></button>

      {/* Middle - Search */}
      <div className="hidden md:flex items-center w-72 relative">
        <FiSearch
          className={`absolute left-3 ${
            mode ? "text-gray-400" : "text-gray-500"
          }`}
        />
        <input
          type="text"
          placeholder="Search courses, lessons..."
          className={`w-full pl-10 pr-4 py-2 rounded-lg border outline-none text-sm transition ${
            mode
              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              : "bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500"
          }`}
        />
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-5">
  
        {/* mode */}
        {mode ? (
                  <div
                    onClick={() => dispatch(setmode())}
                    className={`p-2 hover:bg-[#1F2024] transition-all duration-300 rounded-sm`}
                  >
                    <FaSun className="text-[#2A27F3]" />
                  </div>
                ) : (
                  <div
                    onClick={() => dispatch(setmode())}
                    className={`p-2 hover:bg-black/10 transition-all duration-300 rounded-sm`}
                  >
                    <MdNightlight className="text-black" />
                  </div>
                )}

        {/* Profile */}
        <div className="relative">
          {user?.photoURL ? (
            <img
              src={user?.photoURL.url}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover cursor-pointer transition-transform duration-200 hover:scale-105"
              onClick={() => setOpenProfile(!openProfile)}
            />
          ) : (
            <div
            onClick={() => setOpenProfile(!openProfile)}
            className="h-10 w-10 overflow-hidden rounded-full text-white flex items-center justify-center font-bold">
              <img src="/profile.jpg" alt="" className="object-cover h-full w-full"/>
            </div>
          )}

          {/* Dropdown */}
          {openProfile && (
            <div
              className={`absolute right-0 mt-3 w-44 rounded-xl shadow-lg overflow-hidden z-50 animate-fade-in ${
                mode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              }`}
            >
              <button
              onClick={handleLogout}
              className="w-full px-4 py-2 flex items-center gap-2 hover:bg-red-100 text-red-600 transition text-sm">
                <FiLogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default StudentNav;
