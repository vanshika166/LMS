import { MdSpaceDashboard, } from "react-icons/md";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { IoReaderOutline } from "react-icons/io5";
import { LuNotebookPen } from "react-icons/lu";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { FaRegUser,FaRegStar  } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux'


const TeacherSideBar = () => {
   const mode = useSelector((state)=>state.app.mode)
   const navigate = useNavigate();

const options = [
  { name: "Dashboard", path: "/teacher/dashboard", icon: <MdSpaceDashboard /> },
  { name: " My courses", path: "/teacher/courses", icon: <IoReaderOutline /> },
  { name: "Reviews", path: "/teacher/reviews", icon: <FaRegStar /> },
  { name: "Blogs", path: "/teacher/blogs", icon: <LuNotebookPen /> },
  { name: "Analytics", path: "/teacher/analytics", icon: <TbBrandGoogleAnalytics /> },
   { name: "Earnings", path: "/teacher/earning", icon: <RiMoneyRupeeCircleLine /> },
  { name: " User Profile", path: "/teacher/profile", icon: <FaRegUser /> },
];

  return (
    <div className={` lg:flex hidden h-screen w-[18%] ${mode?"bg-black text-white":"bg-[#F6F5F8] text-black"} font-Nunito flex flex-col p-6`}>
      
      {/* Logo / Brand */}
      <h2
      onClick={()=>(navigate("/"))}
      className='mb-10 font-Nunito text-[#2A27F3] text-4xl'>Learn<span className='text-[#92F64F] font-bold text-[2.5rem]'>Z</span>y</h2>

      {/* Menu Options */}
      <div className="flex flex-col gap-y-4">
        {options.map((elem, index) => (
          <Link 
          to={elem.path}
            key={index} 
            className={`flex items-center gap-x-3 px-4 py-2 rounded-xl ${mode?"text-gray-300 ":"text-gray-700 "} ${mode?"hover:bg-[#1F2024]":"hover:bg-blue-100 hover:text-blue-600"} transition-all duration-300 cursor-pointer`}
          >
            {elem.icon}
            <p className="text-md font-medium">{elem.name}</p>
          </Link>
        ))}
      </div>

      {/* Footer Section (optional) */}
      <div className={`mt-auto text-center text-sm ${mode?"text-gray-200":"text-gray-400"}`}>
        © 2025 Learnzy
      </div>
    </div>
  );
}

export default TeacherSideBar;
