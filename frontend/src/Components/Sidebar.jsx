import { MdSpaceDashboard,MdOutlinePayment  } from "react-icons/md";
import { IoSchoolSharp  } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { FaBookOpen } from "react-icons/fa6";
import { PiCertificate } from "react-icons/pi";

const Sidebar = () => {
  const mode = useSelector((state)=>state.app.mode)
  const navigate = useNavigate()

const options = [
  { name: "Dashboard", path: "/student/dashboard", icon: <MdSpaceDashboard /> },
  { name: "My learning", path: "/student/courses", icon: <IoSchoolSharp /> },
  { name: "My Wishlist", path: "/student/wishlist", icon: <FaBookOpen /> },
  { name: "My certificates", path: "/student/certificate", icon: <PiCertificate  /> },
  { name: "Payment", path: "/student/payment", icon: <MdOutlinePayment   /> },
  { name: "Profile & Settings", path: "/student/profile", icon: <FaRegUser /> },
];

  return (
    <>
    <div className={`h-screen hidden relative lg:block w-[18%] ${mode?"bg-black text-gray-300":"bg-[#F6F5F8]text-gray-700"} font-Nunito flex flex-col justify-between p-6`}>
      
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
            className={`flex items-center gap-x-4 px-4 py-2 rounded-xl ${mode?"hover:bg-[#1F2024]":"hover:bg-blue-100 hover:text-blue-600"} hover:text-blue-600 transition-all duration-300 cursor-pointer`}
          >
            {elem.icon}
            <p className="text-md font-medium">{elem.name}</p>
          </Link>
        ))}
      </div>

      {/* Footer Section (optional) */}
      <div className="mt-auto absolute bottom-5 left-12 text-center text-sm text-gray-400">
        © 2025 Learnzy
      </div>
    </div>
    </>
    
  );
}

export default Sidebar;
