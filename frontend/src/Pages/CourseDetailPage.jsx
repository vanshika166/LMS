import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaStar,
  FaPlayCircle,
  FaCheckCircle,
  FaHeart,
} from "react-icons/fa";
import ReviewsList from "../Components/ReviewsList.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCurrrentCourse } from "../redux/actions/userCoursesAction.js";
import axios from "axios";
import { appDataContext } from "../Context/AppContext.jsx";
import { toast } from "react-toastify";

const CourseDetailPage = () => {
  const course = useSelector((state) => state.course?.getCurrentCourse);
  const user = useSelector((state) => state.user?.userData);
  const mode = useSelector((state) => state.app.mode);
  const { serverURL } = useContext(appDataContext);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [expandAll, setExpandAll] = useState(false);
  const [isWishlisted, setIswishlisted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(getCurrrentCourse(id));
    }
  }, [dispatch, id]);

    useEffect(() => {
      window.scrollTo({top:0,behavior:"smooth"})
    }, [])

  useEffect(() => {
    if (Array.isArray(user?.wishlist)) {
      setIswishlisted(user.wishlist.includes(id));
    } else {
      setIswishlisted(false);
    }
  }, [user?.wishlist, id]);

  console.log(course)

  const discountedPrice =
    course?.price - (course?.price * course?.discount) / 100;

  // ---- Animation Settings ----
  const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
    viewport: { once: true },
  });

  const addToWishlist = async (id) => {
    try {
      const result = await axios.post(
        serverURL + "/api/wishlist/add-wishlist",
        { id },
        { withCredentials: true }
      );
      if (result) {
        console.log(result);
        toast.success("Added to the Wishlist !");
        setIswishlisted(true);
      }
    } catch (error) {
      console.log("add wishlist error: ", error);
      toast.error(error.response.data);
    }
  };

  const removeWishlist = async (id) => {
    try {
      const result = await axios.post(
        serverURL + "/api/wishlist/remove-wishlist",
        { id },
        { withCredentials: true }
      );
      if (result) {
        console.log(result.data);
        setIswishlisted(false);
        toast.success("removed from wishlist !");
      }
    } catch (error) {
      console.log("remove wishlist error: ", error);
      toast.error(error.response.data);
    }
  };

  const enrollFreecourse = async (id) => {
    try {
      const result = await axios.post(
        serverURL + "/api/enroll/enroll-freeCourse",
        { id },
        { withCredentials: true }
      );
      if (result) {
        console.log(result.data);
        toast.success("Course enrolled successfully.");
      }
    } catch (error) {
      console.log("enrollCourses error: ", error);
      toast.info(error.response.data);
    }
  };

  return (
    <>

      <div
        className={`min-h-screen ${
          mode ? "bg-black text-white" : "bg-[#F6F5F8] text-black"
        } py-20`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT SIDE - MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-10">
            {/* Breadcrumbs */}
            <p className="text-sm text-gray-500">
              Top courses /{" "}
              <span className="text-[#2A27F3] font-medium">{course?.category}</span>
            </p>

            {/* Title */}
            <motion.h1
              {...fadeIn()}
              className={`text-3xl font-bold ${
                mode ? "text-white" : "text-gray-900"
              } leading-snug`}
            >
              {course?.title}
            </motion.h1>

            {/* Stats */}
            <motion.div
              {...fadeIn(0.1)}
              className="flex flex-wrap gap-5 text-sm text-gray-600"
            >
              <span
                className={`flex items-center gap-1 ${
                  mode ? "text-gray-200" : "text-black"
                }`}
              >
                <FaStar className="text-yellow-400" /> {/* {course.ratings} */}
                {`${course?.reviews?.length} Rating`}
              </span>
              <span className="flex items-center gap-1">
                {/* <FaUsers /> {course.students.toLocaleString()} students */}
              </span>
              <span
              onClick={()=>navigate(`/educator/${course.educator._id}`)}
              className={` hover:cursor-pointer ${mode ? "text-gray-200" : "text-black"}`}>
                👨‍🏫 {course?.educator.username}
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              {...fadeIn(0.2)}
              className={`${
                mode ? "text-gray-300" : "text-gray-700"
              } text-[15px] leading-relaxed max-w-3xl`}
            >
              {course?.detailedDescription}
            </motion.p>

            {/* What You'll Learn */}
            {course?.learnings?.length && (
              <motion.section
                {...fadeIn(0.3)}
                className={`${
                  mode
                    ? "bg-[#1C1C1E] text-gray-200 border border-[#2A2A2E]"
                    : "bg-white border border-gray-100 text-gray-900"
                } 
    rounded-2xl shadow-sm p-6 transition-colors duration-300`}
              >
                <h2
                  className={`text-xl font-semibold mb-4 ${
                    mode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  What you’ll learn
                </h2>

                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${
                    mode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {course?.learnings.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 p-3 rounded-lg transition-all duration-300 ${
                        mode
                          ? "bg-[#2A2A2E] hover:bg-[#333337] border border-[#3A3A3C]"
                          : "bg-gray-50 hover:bg-gray-100 border border-gray-100"
                      }`}
                    >
                      <FaCheckCircle
                        className="text-[#A4FE6A] mt-1 flex-shrink-0"
                        size={16}
                      />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            ) }

            {/* Course Content */}
            <motion.section
              {...fadeIn(0.4)}
              className={`${
                mode
                  ? "bg-[#1C1C1E] border border-[#2A2A2E] text-gray-200"
                  : "bg-white border border-gray-100 text-gray-900"
              } rounded-2xl shadow-md p-6 transition-colors duration-300`}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2
                  className={`text-2xl font-semibold ${
                    mode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Course Content
                </h2>
                <button
                  onClick={() => setExpandAll(!expandAll)}
                  className="text-[#2A27F3] text-sm font-semibold hover:underline transition-all"
                >
                  {expandAll ? "Collapse all sections" : "Expand all sections"}
                </button>
              </div>

              {/* Summary */}
              <p
                className={`text-sm mb-6 ${
                  mode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {course?.sections.length} sections •{" "}
                {course?.sections.reduce(
                  (acc, sec) => acc + (sec.lessons?.length || 0),
                  0
                )}{" "}
                lectures •{" "}
                <span
                  className={`${
                    mode ? "text-gray-500" : "text-gray-400"
                  } italic`}
                >
                  Total duration coming soon
                </span>
              </p>

              {/* Sections */}
              <div className="space-y-4">
                {course?.sections.map((sec, idx) => (
                  <details
                    key={idx}
                    open={expandAll}
                    className={`group rounded-xl overflow-hidden transition-all hover:shadow-sm border ${
                      mode
                        ? "bg-[#2A2A2E] border-[#3A3A3C] hover:bg-[#333337]"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <summary
                      className={`cursor-pointer flex justify-between items-center px-5 py-4 font-medium transition-colors ${
                        mode ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <FaPlayCircle
                          className={mode ? "text-[#6D6AFF]" : "text-[#2A27F3]"}
                        />
                        {sec.title}
                      </span>
                      <span
                        className={`text-xs transition-transform group-open:rotate-180 ${
                          mode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        ▼
                      </span>
                    </summary>

                    <motion.ul
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`pl-10 pr-5 pb-3 text-sm space-y-2 ${
                        mode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {sec.lessons.map((lesson, lIdx) => (
                        <li
                          key={lIdx}
                          className={`flex justify-between items-center py-2 border-b last:border-none ${
                            mode ? "border-[#3A3A3C]" : "border-gray-100"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <FaCheckCircle className="text-[#A4FE6A]" />
                            {lesson.title}
                          </span>
                          <span
                            className={`${
                              mode ? "text-gray-500" : "text-gray-400"
                            } text-xs`}
                          >
                            {lesson.duration || "5 min"}
                          </span>
                        </li>
                      ))}
                    </motion.ul>
                  </details>
                ))}
              </div>
            </motion.section>

            {/* outcomes */}
            {course?.outcomes?.length && (
              <motion.section
                {...fadeIn(0.3)}
                className={`${
                  mode
                    ? "bg-[#1C1C1E] border border-[#2A2A2E] text-gray-200"
                    : "bg-white border border-gray-100 text-gray-900"
                } rounded-2xl shadow-sm p-6 transition-colors duration-300`}
              >
                <h2
                  className={`text-xl font-semibold mb-4 ${
                    mode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Outcomes
                </h2>

                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${
                    mode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {course?.outcomes.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 p-3 rounded-lg transition-all duration-300 ${
                        mode
                          ? "bg-[#2A2A2E] hover:bg-[#333337] border border-[#3A3A3C]"
                          : "bg-gray-50 hover:bg-gray-100 border border-gray-100"
                      }`}
                    >
                      <FaCheckCircle
                        className="text-[#A4FE6A] mt-1 flex-shrink-0"
                        size={16}
                      />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            ) }

            {/* Hands-on Projects */}
            {course?.projects?.length > 0 && (
              <motion.section
                {...fadeIn(0.5)}
                className={`${
                  mode
                    ? "bg-[#1C1C1E] border border-[#2A2A2E] text-gray-200"
                    : "bg-white border border-gray-100 text-gray-900"
                } rounded-2xl shadow-sm p-6 transition-colors duration-300`}
              >
                <h2
                  className={`text-xl font-semibold mb-4 ${
                    mode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Hands-on Projects
                </h2>

                <ul
                  className={`list-disc pl-5 space-y-2 ${
                    mode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {course?.projects.map((p, idx) => (
                    <li
                      key={idx}
                      className={`transition-colors duration-200 ${
                        mode
                          ? "marker:text-[#A4FE6A] hover:text-gray-100"
                          : "marker:text-[#2A27F3] hover:text-gray-900"
                      }`}
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.section>
            ) }

            {/* Who This Course is For */}
            {course?.highlights?.length > 0 && (
              <motion.section
                {...fadeIn(0.6)}
                className={`${
                  mode
                    ? "bg-[#1C1C1E] border border-[#2A2A2E] text-gray-200"
                    : "bg-white border border-gray-100 text-gray-900"
                } rounded-2xl shadow-sm p-6 transition-colors duration-300`}
              >
                <h2
                  className={`text-xl font-semibold mb-4 ${
                    mode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Who this course is for
                </h2>

                <ul
                  className={`list-disc pl-5 space-y-2 ${
                    mode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {course?.highlights.map((o, idx) => (
                    <li
                      key={idx}
                      className={`transition-colors duration-200 ${
                        mode
                          ? "marker:text-[#A4FE6A] hover:text-gray-100"
                          : "marker:text-[#2A27F3] hover:text-gray-900"
                      }`}
                    >
                      {o}
                    </li>
                  ))}
                </ul>
              </motion.section>
            ) }

            {/* Reviews Section - always render container; show fallback when empty */}
            <motion.section
              {...fadeIn(0.7)}
              className={`rounded-2xl p-6 transition-colors duration-300
      ${
        mode
          ? "bg-[#1C1C1E] border border-[#2A2A2E] text-gray-200"
          : "bg-white border border-gray-100 text-gray-900"
      }
    `}
            >
              {/* Heading */}
              <h2 className="text-2xl font-semibold mb-6">
                Student Reviews ({course?.reviews?.length || 0})
              </h2>

              {Array.isArray(course?.reviews) && course.reviews.length > 0 ? (
                <ReviewsList reviews={course.reviews} mode={mode} />
              ) : (
                <div
                  className={`p-4 rounded-xl border text-center ${
                    mode ? "bg-[#2A2A2E] border-[#3A3A3C] text-gray-300" : "bg-gray-50 border-gray-100 text-gray-700"
                  }`}
                >
                  No reviews yet. Be the first to review this course!
                </div>
              )}
            </motion.section>
          </div>

          {/* RIGHT SIDE - ENROLL CARD */}
          <motion.aside
            {...fadeIn(0.3)}
            className={`${
              mode ? "bg-[#1F2024]" : "bg-[#F6F5F8] border border-gray-100"
            } rounded-2xl shadow-md p-6 h-fit mt-7 sticky top-10`}
          >
            {/* Course Video */}
            <div className="relative rounded-xl overflow-hidden mb-6">
              {course?.coverVideo ? (
                <video
                  controls
                  controlsList="nodownload"
                  className="w-full h-48 object-cover"
                >
                  <source src={course.coverVideo.url} type="video/mp4" />
                  Your browser does not support the video element.
                </video>
              ) : course?.coverImage ? (
                <img
                  src={course.coverImage.url}
                  className="h-full w-full object-cover"
                  alt=""
                />
              ) : (
                <div className="w-full h-48 bg-white flex items-center justify-center">
                  <p className="text-gray-500">No preview video available</p>
                </div>
              )}
            </div>

            {/* Pricing */}
            {course?.price > 0 ? (
              <div className="mb-5">
                <h2 className="text-4xl font-extrabold text-[#2A27F3] tracking-tight">
                  ₹{discountedPrice.toLocaleString()}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="line-through text-gray-400 text-lg">
                    ₹{course?.price?.toLocaleString()}
                  </span>
                  <span className="bg-[#A4FE6A]/20 text-[#2A27F3] font-semibold text-sm px-3 py-1 rounded-full border border-[#A4FE6A]/40">
                    {course?.discount}% OFF
                  </span>
                </div>
                <p className="mt-2 text-xs text-gray-500 italic">
                  Limited time offer – enroll now to save!
                </p>
              </div>
            ) : (
              <div className="mb-4 text-[#2A27F3] font-semibold px-4 py-2 rounded-lg inline-block">
                🎉 This course is <span className="underline">Free</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {/* Main Action Button */}
              <button
                onClick={() =>
                  course?.isFree
                    ? enrollFreecourse(course._id)
                    : buyCourse(course._id)
                }
                className="w-full py-3 bg-[#2A27F3] text-white font-semibold rounded-xl hover:scale-[1.02] transition"
              >
                {course?.isFree ? "Start Learning for Free" : "Buy Now"}
              </button>

              {/* Add to Cart + Wishlist */}
              <div className="flex items-center justify-between gap-3">
                <button
                  className={`flex-1 py-2.5 rounded-xl font-semibold border transition ${
                    mode
                      ? "border-[#2A27F3] text-[#A4FE6A] hover:bg-[#2A27F3] hover:text-white"
                      : "border-[#2A27F3] text-[#2A27F3] hover:bg-[#2A27F3] hover:text-white"
                  }`}
                >
                  Add to Cart
                </button>

                <button
                  onClick={() =>
                    isWishlisted ? removeWishlist(id) : addToWishlist(id)
                  }
                  className={`w-12 h-11 flex items-center justify-center rounded-xl border font-semibold transition-all duration-300
    ${
      mode
        ? isWishlisted
          ? "bg-[#2A27F3] text-white border-[#2A27F3]" // dark mode + wishlisted
          : "border-[#2A27F3] text-[#A4FE6A] hover:bg-[#2A27F3] hover:text-white" // dark mode default
        : isWishlisted
        ? "bg-[#2A27F3] text-white border-[#2A27F3]" // light mode + wishlisted
        : "border-[#2A27F3] text-[#2A27F3] hover:bg-[#2A27F3] hover:text-white" // light mode default
    }`}
                >
                  <FaHeart className="text-lg" />
                </button>
              </div>
            </div>

            {/* Includes */}
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h3
                className={`font-semibold mb-3 ${
                  mode ? "text-white" : "text-gray-900"
                }`}
              >
                This course includes
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  "video lectures, PDFs, images",
                  "Downloadable resources",
                  "Access on mobile and desktop",
                  "Certificate of completion",
                ].map((item, index) => (
                  <li
                    key={index}
                    className={`flex items-center gap-2 ${
                      mode ? "text-gray-300" : "text-black"
                    }`}
                  >
                    <FaPlayCircle className="text-[#2A27F3]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>
        </div>
      </div>
    </>
  );
};

export default CourseDetailPage;
