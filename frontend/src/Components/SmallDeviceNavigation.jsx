import { MdSpaceDashboard } from "react-icons/md";
import { IoReaderOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";

const SmallDeviceNavigation = ({handlesmall}) => {
  const options = [
    {
      name: "Dashboard",
      path: "/student/dashboard",
      icon: <MdSpaceDashboard size={22} />,
    },
    { name: "My Courses", path: "/student/courses", icon: <IoReaderOutline size={22} /> },
    {
      name: "Profile & Settings",
      path: "/student/profile",
      icon: <FaRegUser size={22} />,
    },
  ];

  return (
    <div className="h-screen w-full bg-[#F6F5F8] text-black absolute p-6 flex flex-col items-center">
      {/* Branding */}
      <div onClick={()=>handlesmall()}>
      <RxCross1 className="text-black absolute inset-5" />
      </div>
      <h1 className="text-3xl font-extrabold text-[#2A27F3] tracking-wide mb-10">
        Learn<span className="text-[#86f23d]">Z</span>y
      </h1>

      {/* Navigation */}
      <div className="flex flex-col w-full gap-y-4">
        {options.map((elem, index) => (
          <Link
            to={elem.path}
            key={index}
            className="flex items-center gap-x-4 px-5 py-3 w-full 
                       bg-white/10 backdrop-blur-lg border border-white/20 
                       rounded-2xl text-black hover:bg-white/20 hover:scale-[1.02]
                       transition-all duration-300 cursor-pointer shadow-md"
          >
            <span className="text-xl">{elem.icon}</span>
            <p className="text-lg font-medium">{elem.name}</p>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-auto text-sm text-white/70">© 2025 LearnZy</p>
    </div>
  );
};

export default SmallDeviceNavigation;
