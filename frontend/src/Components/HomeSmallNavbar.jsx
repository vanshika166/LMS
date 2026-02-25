import { HiOutlineMenuAlt3 } from "react-icons/hi";
import {  useSelector } from "react-redux";

const HomeSmallNavbar = ({setIsOpen}) => {
  const mode = useSelector((state) => state.app.mode);

  return (
    <div
      className={`w-full p-3 fixed top-0 z-10 lg:hidden flex items-center justify-between px-[1rem] md:px-6 ${
        mode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Logo */}
      <h2 className="font-Nunito text-[#2A27F3] text-3xl md:text-2xl">
        Learn
        <span className="text-[#92f64f] font-bold text-[1.3rem]">Z</span>y
      </h2>

      {/* Menu Button */}
      <div className="flex items-center gap-3">

        <button
        onClick={()=>setIsOpen(true)}
        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-md bg-[#2A27F3] text-white hover:bg-[#1a1a8f] active:scale-95 transition-all duration-150">
          <HiOutlineMenuAlt3 size={20} />
        </button>
      </div>
    </div>
  );
};

export default HomeSmallNavbar;
