import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt,FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { MdNightlight } from "react-icons/md";
import { FaSun } from "react-icons/fa";
import { setmode } from "../redux/appSlice.js";
import UserProfile from "./UserProfile.jsx";

const Navigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const mode = useSelector((state) => state.app.mode);
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    localStorage.setItem("mode", JSON.stringify(mode));
  }, [mode]);

 useEffect(() => {
  const handleOnScroll = () => {
    if (window.scrollY > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  window.addEventListener("scroll", handleOnScroll);

  return () => {
    window.removeEventListener("scroll", handleOnScroll);
  };
}, []);

  

  return (
<div
  className={`w-full fixed top-0 z-50 px-[2rem] p-3 lg:flex hidden items-center justify-between transition-all duration-300
  ${
    scrolled
      ? mode
        ? "bg-black "
        : "bg-[#F6F5F8] "
      : "bg-transparent"
  }
  ${mode ? "text-white" : "text-black"}
  `}
>


      <h2 className="font-Nunito text-[#2A27F3] text-4xl">
        Learn
        <span className="text-[#92f64f] font-bold text-[2.5rem]">Z</span>y
      </h2>

      <div className="flex items-center gap-x-5 pr-20">
        {["Home", "Courses", "About","Blog"].map((elem, index) => {
          return (
            <div
              onClick={() => {
                if (elem === "Home") {
                  navigate("/");
                } else {
                  navigate(`/${elem}`);
                }
              }}
              key={index}
              className="cursor-default font-Nunito overflow-hidden h-6 items-center flex flex-col text-md group w-[5rem]"
            >
              <p className="relative transition-transform duration-300 group-hover:-translate-y-5">
                {elem}
              </p>
              <p className="relative transition-transform duration-300 text-[#2A27F3] group-hover:-translate-y-6">
                {elem}
              </p>
            </div>
          );
        })}
      </div>

      {/* buttons */}
      <div className="flex font-Nunito font-semibold items-center gap-x-3">
        {/* change mode */}
        {mode ? (
          <div onClick={() => dispatch(setmode())} className="mr-5">
            <FaSun />
          </div>
        ) : (
          <div onClick={() => dispatch(setmode())} className="mr-5">
            <MdNightlight />
          </div>
        )}

        {/* login button  */}
        {!user || Object.keys(user).length === 0 ? (
          <div className="flex items-center p-2  gap-x-2 text-[#2A27F3] hover:bg-[#2A27F3] hover:text-white rounded-md transition-all duration-300">
            <FaUserAlt size={16} className="font-bold" />
            <button onClick={() => navigate("/login")} className="   ">
              Log In
            </button>
          </div>
        ) : (
          <UserProfile/>
        )}

        {/* signup button */}
        {!user || Object.keys(user).length === 0 ? (
          <button
            onClick={() => navigate("/signup")}
            className="group bg-[#2A27F3] hover:bg-[#3334FE] text-white transition-colors duration-300 p-2 px-6 rounded-md flex"
          >
            {" "}
            Get started
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default Navigation;
