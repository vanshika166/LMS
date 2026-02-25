import { useState } from "react";
import Sidebar from "../Components/Sidebar.jsx";
import StudentNav from "../Components/StudentNav.jsx";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import SmallStudentSidebar from "../Components/SmallStudentSidebar.jsx";

const Student_Home = () => {
  const [open, setOpen] = useState(false);
  const mode = useSelector((state)=>state.app.mode)

  const handlesmall = () => setOpen(!open);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div className={`w-full h-screen flex relative ${mode?"bg-black":"bg-[#F6F5F8]"}`}>
        <Sidebar />
        <SmallStudentSidebar open={open} onClose={handleClose} />
        
        
        
        <div className="h-screen w-[80rem] flex flex-col">
          <StudentNav handlesmall={handlesmall} />

            <Outlet />

        </div>
      </div>
    </>
  );
};

export default Student_Home;
