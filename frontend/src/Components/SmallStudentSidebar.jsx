import { useDispatch, useSelector } from "react-redux";
import { MdSpaceDashboard, MdOutlinePayment } from "react-icons/md";
import { IoSchoolSharp } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa6";
import { PiCertificate } from "react-icons/pi";
import { FiLogOut } from "react-icons/fi";
import axios from "axios";
import { useContext } from "react";
import { appDataContext } from "../Context/AppContext.jsx";
import { setUserData } from "../redux/userSlice.js";

const SmallStudentSidebar = ({ open, onClose }) => {
  const mode = useSelector((state) => state.app.mode);
  const user = useSelector((state) => state.user.userData);
  const {serverURL} = useContext(appDataContext)
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch()

  const options = [
    {
      name: "Dashboard",
      path: "/student/dashboard",
      icon: <MdSpaceDashboard />,
    },
    { name: "My learning", path: "/student/courses", icon: <IoSchoolSharp /> },
    { name: "My Wishlist", path: "/student/wishlist", icon: <FaBookOpen /> },
    {
      name: "My certificates",
      path: "/student/certificate",
      icon: <PiCertificate />,
    },
    { name: "Payment", path: "/student/payment", icon: <MdOutlinePayment /> },
    {
      name: "Profile & Settings",
      path: "/student/profile",
      icon: <FaRegUser />,
    },
  ];

  // theme classes
  const sidebarBg = mode ? "bg-[#0D0D0D]" : "bg-[#F4FEFF]";
  const textDefault = mode ? "text-white" : "text-gray-900";
  const subText = mode ? "text-gray-300" : "text-gray-700";
  const hoverBg = mode ? "hover:bg-white/6" : "hover:bg-blue-50";
  const activeBg = mode
    ? "bg-[#1F2430] text-[#92f64f]"
    : "bg-[#E8F0FF] text-[#2A27F3]";
  const borderColor = mode ? "border-white/6" : "border-gray-200";

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
    <>
      {/* overlay */}
      <div
        onClick={() => onClose && onClose()}
        className={`fixed inset-0 z-40 lg:hidden transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: open ? "rgba(0,0,0,0.7)" : "transparent" }}
        aria-hidden={!open}
      />

      <aside
        className={`fixed top-0 left-0 z-60 h-full w-[80%] md:w-[50%] lg:hidden ${sidebarBg} ${borderColor} shadow-2xl overflow-auto transform transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-label="Main menu"
      >
        {/* profile */}
        <div className={`px-5 py-6 border-b ${borderColor}`}>
          <div className="flex items-center gap-4">
            <img
              src={user?.photoURL ? user.photoURL.url : "/profile.jpg"}
              alt="profile"
              className="w-14 h-14 rounded-full object-cover shadow-sm"
            />
            <div>
              <div className={`font-semibold ${textDefault}`}>
                {user?.username}
              </div>
              <div className={`text-sm ${subText}`}>{user?.email}</div>
            </div>
          </div>
          <button
            onClick={() => navigate("/student/profile")}
            className={`mt-4 px-3 py-2 rounded-md text-sm font-medium ${mode ? "bg-white/5 text-white" : "bg-[#eef2ff] text-[#2A27F3]"}`}
          >
            View profile
          </button>
        </div>

        {/* nav */}
        <nav className="px-3 py-4 space-y-2">
          {options.map((it) => {
            const active = location.pathname === it.path;
            return (
              <Link
                key={it.path}
                to={it.path}
                onClick={(e) => {
                  e.preventDefault(); // control navigation to animate close first
                  if (onClose) onClose();
                  // wait for slide-out animation then navigate
                  setTimeout(() => navigate(it.path), 180);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${active ? activeBg : `${hoverBg} ${subText}`}`}
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={`w-6 h-6 flex items-center justify-center ${active ? "text-current" : ""}`}
                >
                  {it.icon}
                </span>
                <span className={`font-medium ${active ? "" : subText}`}>
                  {it.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* footer actions */}
        <div
          className={`absolute bottom-3 left-0 right-0 px-5 py-5 border-t ${borderColor} bg-opacity-90`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-red-600 text-white"
            >
              <FiLogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SmallStudentSidebar;
