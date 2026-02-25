import { FaBookOpen, FaAward, FaChartBar, FaUserTie } from "react-icons/fa";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {useNavigate} from 'react-router-dom'

 function FeaturesSection() {
  const mode = useSelector((state)=>state.app.mode)
  const navigate = useNavigate()

  const features = [
    {
      icon: <FaBookOpen className="w-12 h-12 text-[#2A27F3]" />,
      title: "Learn Anytime, Anywhere",
      description:
        "Access your courses from mobile, tablet, or desktop. Study at home, on the go, or whenever you find the time—learning has never been this flexible.",
    },
    {
      icon: <FaAward className="w-12 h-12 text-[#A4FE6A]" />,
      title: "Interactive Quizzes & Certificates",
      description:
        "Test your knowledge with engaging quizzes and earn shareable certificates to showcase your achievements.",
    },
    {
      icon: <FaChartBar className="w-12 h-12 text-[#2A27F3]" />,
      title: "Track Progress Easily",
      description:
        "Stay motivated with detailed dashboards and progress bars that show your growth step by step.",
    },
    {
      icon: <FaUserTie className="w-12 h-12 text-[#A4FE6A]" />,
      title: "Expert Instructors",
      description:
        "Learn from certified teachers and industry professionals who make complex topics simple and practical.",
    },
  ];

  return (
    <section className={`py-12 sm:py-16 md:py-20 ${mode?"bg-black text-white":"bg-[#F6F5F8] text-black"} cursor-default`}>
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`text-3xl sm:text-4xl font-extrabold font-Nunito text-center mb-4 ${mode?"text-white":"text-gray-900"}`}
        >
          Why Choose Our Platform
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-sm sm:text-base text-center mb-10 sm:mb-14 max-w-2xl mx-auto ${mode?"text-gray-300":"text-gray-600"}`}
        >
          Designed for learners of all levels, our platform makes education
          simple, engaging, and effective.
        </motion.p>

        {/* Feature Grid */}
        <div className="grid gap-6 sm:gap-8 lg:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`${mode?"bg-[#1F2024] text-white":"bg-white text-black"} shadow-lg rounded-2xl p-6 sm:p-8 hover:shadow-2xl transition relative overflow-hidden`}
            >
              {/* Accent Border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2A27F3] to-[#A4FE6A]" />
              <div className="flex justify-center mb-4 sm:mb-6">{feature.icon}</div>
              <h3 className={`text-lg sm:text-xl ${mode?"text-white":"text-gray-900"} font-semibold mb-3`}>
                {feature.title}
              </h3>
              <p className={`text-xs sm:text-sm ${mode?"text-gray-300":"text-gray-600"} leading-relaxed`}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{once:true}}
          transition={{ delay: 0.3 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <button
          onClick={()=>navigate("/Courses")}
          className="px-6 sm:px-8 py-2 sm:py-3 cursor-pointer bg-[#2A27F3] text-white hover:bg-[#1d1acc] rounded-full text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition hover:scale-105">
            Explore Courses
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturesSection;