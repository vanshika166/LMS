import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { allCourses } from "../redux/actions/userCoursesAction.js";
import { useNavigate } from "react-router-dom";

const AllCourses = () => {
  const dispatch = useDispatch();
  const allcourse = useSelector((state) => state.course.allCourses);
  const mode = useSelector((state) => state.app.mode);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({top:0,behavior:"smooth"})
  }, [])


  useEffect(() => {
    dispatch(allCourses());
  }, [dispatch]);

  useEffect(() => {
    if (allcourse) console.log(allcourse);
  }, [allcourse]);

  return (
    <>
      {/* 🌈 HERO SECTION */}
      <section
        className={`relative flex cursor-default flex-col justify-center items-center text-center py-30 px-6 ${
          mode ? "bg-black" : "bg-[[#F8F9FB]"
        }`}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`text-5xl font-bold tracking-tight ${
            mode ? "text-white" : "text-gray-900"
          }`}
        >
          Explore All Courses
        </motion.h1>

        <p
          className={`mt-4 max-w-2xl text-lg ${
            mode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Learn from industry experts and grow your skills with our curated
          courses.
        </p>
      </section>




      {/* 🧱 COURSE GRID */}
      <section
        className={`min-h-screen px-10 py-3 transition-colors duration-300 ${
          mode ? "bg-black" : "bg-[#F8F9FB]"
        }`}
      >
        <div className="max-w-7xl mx-auto grid gap-10 grid-cols-1 place-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allcourse?.map((course) => (
            <motion.div
              key={course._id}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`rounded-2xl w-[20rem] overflow-hidden shadow-xl relative group border transition-all duration-300 ${
                mode
                  ? "bg-[#1E1F24] border-[#2D2E34] hover:shadow-[0_0_30px_rgba(42,39,243,0.25)]"
                  : "bg-white border-gray-200 hover:shadow-[0_10px_30px_rgba(42,39,243,0.1)]"
              }`}
            >
              {/* IMAGE */}
              <div className="relative w-full h-52 overflow-hidden">
                <img
                  src={course.coverImage.url}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition duration-300" />
                <span className="absolute top-3 left-3 bg-[#A4FE6A] text-black text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  Bestseller
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-5 flex flex-col justify-between h-[220px]">
                <div>
                  <h3
                    className={`text-md font-semibold leading-snug ${
                      mode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {course.title}
                  </h3>
                  <p
                    className={`text-sm mt-2 ${
                      mode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    By {course.educator.username}
                  </p>
                </div>

                {/* FOOTER */}
                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400 font-medium flex items-center gap-1">
                      ⭐ {course?.rating || "4.8"}
                    </span>

                    {course.discount > 0 ? (
                      <span className="text-[#2A27F3] font-bold text-lg">
                        ₹{" "}
                        {course.price - (course.price * course.discount) / 100}
                      </span>
                    ) : (
                      <span className="text-[#2A27F3] font-bold text-lg">
                        ₹ {course.price}
                      </span>
                    )}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(`/course-detail/${course._id}`)}
                    className="mt-5 w-full py-2.5 rounded-lg font-semibold text-sm tracking-wide bg-gradient-to-r from-[#2A27F3] cursor-pointer to-[#544BFE] text-white hover:opacity-90 transition-all duration-300"
                  >
                    {course.isFree ? "Enroll for Free" : "Enroll Now"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default AllCourses;
