import React, { useState } from "react";
import LandingPage from "./LandingPage.jsx";
import FeaturesSection from "./FeaturesSection.jsx";
import PopularCourses from "./PopularCourses .jsx";
import CoursesSection from "./CoursesSection.jsx";
import FAQ from "./FAQ.jsx";
import SuccessStories from "./SuccessStories.jsx";
import TestimonialsPage from "../Pages/TestimonialsPage.jsx";


const Home = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="min-h-screen w-full">
      <LandingPage />
      <FeaturesSection />
      <PopularCourses />
      <CoursesSection />
      <TestimonialsPage />
      <FAQ />
      {/* <Pricing /> */}
      <SuccessStories />
    </div>
  );
};

export default Home;
