import React, { useState } from "react";
import Navigation from "../Navigation.jsx";
import Footer from "../../Pages/Footer.jsx";
import { Outlet } from "react-router-dom";
import Menubar from "../Menubar.jsx";
import HomeSmallNavbar from "../HomeSmallNavbar.jsx";

const MainLayout = () => {
    const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="min-h-screen w-full">
      <Navigation />
      <Menubar isOpen={isOpen} setIsOpen={setIsOpen}/>
      <HomeSmallNavbar isOpen={isOpen} setIsOpen={setIsOpen}/>
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
