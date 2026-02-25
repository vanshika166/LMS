import { useDispatch, useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaSun,
  FaMoon,
  FaLinkedin,
} from "react-icons/fa";
import { useEffect } from "react";
import { setmode } from "../redux/appSlice.js";
import { useNavigate } from "react-router-dom";

const Menubar = ({ isOpen, setIsOpen }) => {
  const mode = useSelector((state) => state.app.mode);
  const user = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("mode", JSON.stringify(mode));
  }, [mode]);

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-full md:w-2/3 lg:hidden transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } ${mode ? "bg-black text-white" : "bg-[#F6F5F8] text-black"}`}
    >
      <div className="h-full flex flex-col justify-between px-6 md:px-8 py-8 md:py-10">
        {/* TOP SECTION */}
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-Nunito text-[#2A27F3] text-3xl">
              Learn
              <span className="text-[#92f64f] font-bold text-[1.3rem]">Z</span>y
            </h2>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-[#2A27F3] hover:text-white transition"
            >
              <MdClose size={22} />
            </button>
          </div>

        

          {/* Menu Items */}
          <div className="flex flex-col gap-8">
            {/* Auth buttons shown only when user is not authenticated */}
            {!user || Object.keys(user).length === 0 ? (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigate("/signup");
                    setIsOpen(false);
                  }}
                  className="bg-[#2A27F3] text-white font-semibold py-2 px-4 rounded-md"
                >
                  Sign up
                </button>
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                  className="border border-[#2A27F3] text-[#2A27F3] font-semibold py-2 px-4 rounded-md"
                >
                  Login
                </button>
              </div>
            ) : null}

            {((user && Object.keys(user).length > 0) ? ["Dashboard", "Courses", "About" ,"Blog"] : ["Home", "Courses","About", "Blog"]).map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 cursor-pointer group"
                onClick={() => {
                  if (item === "Home") navigate("/");
                  else if (item === "Dashboard") {
                    if (user?.role === "educator") navigate("/teacher/dashboard");
                    else navigate("/student/dashboard");
                  } else navigate(`/${item}`);
                  setIsOpen(false);
                }}
              >
                <div className="w-2 h-2 rounded-full bg-[#2A27F3] opacity-0 group-hover:opacity-100 transition"></div>

                <h1 className="text-2xl font-light tracking-wide transition-all duration-300 group-hover:text-[#2A27F3]">
                  {item}
                </h1>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col gap-8">
          {/* Divider */}
          <div
            className={`h-px w-full ${mode ? "bg-white/10" : "bg-black/10"}`}
          />

          {/* Appearance */}
          <div className="flex items-center justify-between">
            <span className="text-sm uppercase tracking-widest opacity-60">
              Appearance
            </span>

            <div
              onClick={() => dispatch(setmode())}
              className="cursor-pointer hover:text-[#2A27F3] transition"
            >
              {mode ? <FaSun size={18} /> : <FaMoon size={18} />}
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-6 justify-center">
            {[FaLinkedin, FaInstagram, FaFacebook, FaTwitter].map(
              (Icon, index) => (
                <Icon
                  key={index}
                  size={20}
                  className="cursor-pointer opacity-60 hover:opacity-100 hover:text-[#2A27F3] transition"
                />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menubar;
