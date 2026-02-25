import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { categoryCourses } from "../redux/actions/userCoursesAction.js";

const CategoryCoursePage = () => {
  const { categorySlug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mode = useSelector((state) => state.app.mode);
  const courses = useSelector((state) => state.course.categoryCourse);

  useEffect(() => {
    dispatch(categoryCourses(decodeURIComponent(categorySlug)));
    console.log(categorySlug);
  }, [dispatch, categorySlug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* 🌈 HERO SECTION */}
      <section
        className={`relative flex flex-col justify-center items-center text-center py-30 px-6 ${
          mode ? "bg-black" : "bg-[#F6F5F8]"
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
          {decodeURIComponent(categorySlug)} Courses
        </motion.h1>

        <p
          className={`mt-4 max-w-2xl text-lg ${
            mode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Explore top courses in {decodeURIComponent(categorySlug)} and level up
          your skills.
        </p>

      </section>

      {/* 🧱 COURSE GRID */}
      <section
        className={`min-h-screen px-10 py-5 ${
          mode ? "bg-black" : "bg-[#F8F9FB]"
        }`}
      >
        <div className="max-w-7xl mx-auto grid gap-10 grid-cols-1 place-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses && courses.length > 0 ? (
            courses.map((course) => (
              <motion.div
                key={course._id}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className={`rounded-2xl w-[20rem] overflow-hidden shadow-xl group border ${
                  mode
                    ? "bg-[#1E1F24] border-[#2D2E34]"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* IMAGE */}
                <div className="relative w-full h-52 overflow-hidden">
                  <img
                    src={course.coverImage.url}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-5 flex flex-col justify-between h-[220px]">
                  <div>
                    <h3
                      className={`text-md font-semibold ${
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

                  <div className="mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-400 font-medium">
                        ⭐ {course?.rating || "4.8"}
                      </span>

                      <span className="text-[#2A27F3] font-bold text-lg">
                        ₹{" "}
                        {course.discount > 0
                          ? course.price -
                            (course.price * course.discount) / 100
                          : course.price}
                      </span>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(`/course-detail/${course._id}`)}
                      className="mt-5 w-full py-2.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-[#2A27F3] to-[#544BFE] text-white hover:opacity-90 transition"
                    >
                      {course.isFree ? "Enroll for Free" : "Enroll Now"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="w-full text-center justify-center py-10">
              <p className="text-gray-500 text-lg font-medium">
                No such course found.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CategoryCoursePage;
