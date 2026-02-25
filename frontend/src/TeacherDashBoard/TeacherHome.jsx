import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TeacherSideBar from "../Components/TeacherSideBar.jsx";
import TeacherNavbar from "../Components/TeacherNavbar.jsx";
import {useSelector} from 'react-redux';
import SmallTeacherSideBar from "../Components/SmallTeacherSideBar.jsx";

const TeacherHome = () => {
  const mode = useSelector((state)=>state.app.mode)
  const [open, setOpen] = useState(false);

  const handlesmall = () => setOpen(!open);
  const handleClose = () => setOpen(false);

  return (
    <div className={`h-screen w-full ${mode?"bg-black":"bg-[#F6F5F8]"} flex`}>
      <TeacherSideBar />
      <SmallTeacherSideBar open={open} onClose={handleClose}/>
      <div className="flex flex-col h-screen w-full">
        <TeacherNavbar handlesmall={handlesmall}/>
        {/* Yaha nested routes ka content load hoga */}

          <Outlet />

      </div>
    </div>
  );
};

export default TeacherHome;
