import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FiPlayCircle } from "react-icons/fi";
import { BsClock, BsStarFill} from "react-icons/bs";
import { MdOutlineDoneAll  } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { appDataContext } from "../Context/AppContext.jsx";

const Student_Courses = () => {
  const { serverURL } = useContext(appDataContext);
  const mode = useSelector((state) => state.app.mode);
  const user = useSelector((state) => state.user?.userData);
  const [allCourses, setAllCourses] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [courseProgress, setCourseProgress] = useState(null)


  useEffect(() => {
    allEnrolledCourses();
  }, []);

  useEffect(() => {
    if(user && user.courseProgress){
      setCourseProgress(user.courseProgress)
    }
    console.log(courseProgress)
  }, [user,courseProgress])
  

  const allEnrolledCourses = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverURL + "/api/enroll/user-enroll-courses",
        {},
        { withCredentials: true }
      );
      if (result) {
        setAllCourses(result.data);
      }
    } catch (error) {
      console.error("fetch enrolled courses error:", error);
      const msg = error?.response?.data || "Failed to load courses.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // function to add course in courseProgress:
  const addToCourseProgress = async (id) => {
    try {
      const result = await axios.post(
        serverURL + "/api/progress/add-progress",
        { id },
        { withCredentials: true }
      );
      if (result) {
        // open the class page
        navigate(`/class/${id}`);
      }
    } catch (error) {
      console.log("addToCourseProgress error:", error);
      const msg =
        error?.response?.data ||
        error?.message ||
        "Failed to start/resume course";
      toast.error(msg);
    }
  };

  // helper: get progress object for a course from user.courseProgress
  const getProgressForCourse = (courseId) => {
    try {
      if (!user?.courseProgress || !Array.isArray(user.courseProgress))
        return null;
      return user.courseProgress.find(
        (p) => String(p.course) === String(courseId)
      );
    } catch (e) {
      return null;
    }
  };

  // helper: compute percentage & counts for display
  const computeProgressValues = (course = {}, progressObj = null) => {
    // 1) total lessons (from sections or fallbacks)
    let total = 0;
    if (Array.isArray(course.sections)) {
      course.sections.forEach((section) => {
        if (Array.isArray(section.lessons)) total += section.lessons.length;
      });
    } else if (typeof course.totalLectures === "number") {
      total = course.totalLectures;
    } else if (typeof course.lecturesCount === "number") {
      total = course.lecturesCount;
    } else {
      total = 0;
    }

    // 2) completed lessons (handle multiple possible progress shapes)
    let complete = 0;
    if (progressObj) {
      // numeric shorthand
      if (typeof progressObj.completedLectures === "number") {
        complete = progressObj.completedLectures;
      }
      // nested courseProgress array (older shape)
      else if (Array.isArray(progressObj.courseProgress)) {
        progressObj.courseProgress.forEach((cp) => {
          if (Array.isArray(cp.sections)) {
            cp.sections.forEach((sec) => {
              if (Array.isArray(sec.completedLessons)) {
                sec.completedLessons.forEach((ls) => {
                  if (ls?.completed) complete++;
                });
              }
            });
          } else if (Array.isArray(cp.completedLessons)) {
            cp.completedLessons.forEach((ls) => {
              if (ls?.completed) complete++;
            });
          }
        });
      }
      // flat sections on progressObj
      else if (Array.isArray(progressObj.sections)) {
        progressObj.sections.forEach((sec) => {
          if (Array.isArray(sec.completedLessons)) {
            sec.completedLessons.forEach((ls) => {
              if (ls?.completed) complete++;
            });
          }
        });
      }
      // boolean completed flag (treat as all completed)
      else if (progressObj.CourseCompleted === true || progressObj.courseCompleted === true || progressObj.completed === true) {
        complete = total;
      }
    } else if (typeof course.completedLectures === "number") {
      // fallback to course-level completed count
      complete = course.completedLectures;
    }

    total = Number(total) || 0;
    complete = Number(complete) || 0;

    // 3) percentage (correct formula)
    const percentage = total > 0 ? Math.round((complete / total) * 100) : 0;

    // 4) completion flag (prefer explicit flags or derived percentage)
    const isCompleted =
      Boolean(
        progressObj?.CourseCompleted ||
          progressObj?.courseCompleted ||
          progressObj?.completed === true ||
          course.CourseCompleted
      ) || percentage >= 100;

    return { percentage, total, complete, isCompleted };
  };


  const containerBg = mode
    ? "bg-black text-white"
    : "bg-[#f7fafc] text-gray-900";
  const cardBg = mode
    ? "bg-white/4 border-white/8"
    : "bg-white border-gray-100";
  const subtleText = mode ? "text-gray-300" : "text-gray-600";

  return (
    <div
      className={`h-screen overflow-auto w-full p-6 md:p-10 transition-all duration-500 ${containerBg} font-Nunito`}
    >
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Continue Learning (top hero) */}
       {user?.allEnrolledCourses?.length !== 0 ?<div
          className={`rounded-3xl overflow-hidden shadow-xl ${
            mode ? "bg-[#0b0b0b]" : "bg-white"
          }`}
        >
          <div className="md:flex">
            <div className="md:w-1/3 relative">
              <img
                src="/auth.png"
                alt="Continue preview"
                className="w-full h-56 md:h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Resume main course"
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border-0"
                  style={{
                    background: "linear-gradient(90deg,#2A27F3,#92f64f)",
                  }}
                >
                  <FiPlayCircle className="w-7 h-7 text-white" />
                </motion.button>
              </div>
            </div>

            <div className="p-6 md:p-8 flex-1">
              <h1
                className={`text-2xl md:text-3xl font-semibold mb-2 ${
                  mode ? "text-white" : "text-gray-900"
                }`}
              >
                Continue Learning
              </h1>
              <p className={`text-sm ${subtleText} mb-4`}>
                Pick up where you left off — progress is saved automatically.
                Click resume to continue your learning journey.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    // try to resume the first in-progress course if exists
                    const inProgress = (allCourses || []).find((c) => {
                      const p = getProgressForCourse(c._id);
                      const vals = computeProgressValues(c, p);
                      return vals.percentage > 0 && vals.percentage < 100;
                    });
                    if (inProgress) addToCourseProgress(inProgress._id);
                    else if (allCourses && allCourses.length > 0)
                      navigate(`/course-detail/${allCourses[0]._id}`);
                    else toast.info("No enrolled courses to resume.");
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white shadow"
                  style={{
                    background: "linear-gradient(90deg,#2A27F3,#92f64f)",
                  }}
                >
                  <FiPlayCircle />
                  Resume
                </button>

                <button
                  onClick={() => navigate("/courses")}
                  className={`px-4 py-2 rounded-lg font-semibold border ${
                    mode
                      ? "border-white/10 text-white/80"
                      : "border-gray-200 text-gray-700"
                  }`}
                >
                  Browse Courses
                </button>
              </div>
            </div>
          </div>
        </div>:null}
        

        {/* My Courses header */}
        <div className="flex items-center justify-between">
          <h2
            className={`text-2xl font-semibold ${
              mode ? "text-white" : "text-gray-900"
            }`}
          >
            My Courses
          </h2>
          <p className={`text-sm ${subtleText}`}>
            Enrolled courses — progress and quick actions
          </p>
        </div>

        {/* Course Grid */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className="animate-pulse rounded-xl h-64 bg-gray-200/40"
                />
              ))}
            </div>
          ) : !allCourses || allCourses.length === 0 ? (
            <div
              className={`rounded-xl p-8 text-center ${
                mode ? "bg-white/3" : "bg-white"
              }`}
            >
              <p className={`${subtleText} mb-4`}>
                You haven't enrolled in any courses yet.
              </p>
              <button
                onClick={() => navigate("/courses")}
                className="px-4 py-2 rounded-full font-semibold text-white"
                style={{ background: "linear-gradient(90deg,#2A27F3,#92f64f)" }}
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {allCourses.map((course) => {
                const progressObj = getProgressForCourse(course._id);
                const { total, complete, percentage, isCompleted } =
                  computeProgressValues(course, progressObj);

                return (
                  <motion.div
                    key={course._id}
                    whileHover={{ translateY: -6 }}
                    transition={{ duration: 0.22 }}
                    className={`rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer ${cardBg}`}
                    onClick={() => navigate(`/course-detail/${course._id}`)}
                  >
                    {/* Image */}
                    <div className="relative h-44">
                      <img
                        src={course.coverImage.url || "/course-placeholder.png"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />

                      {isCompleted && (
                        <div className="absolute top-3 right-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow">
                          Completed
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col gap-4">
                      {/* Title + Educator */}
                      <div>
                        <h3
                          className={`text-lg font-semibold leading-snug line-clamp-2 ${
                            mode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {course.title}
                        </h3>
                        <p className={`text-xs mt-1 ${subtleText}`}>
                          By {course.educator?.username || "Unknown"}
                        </p>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            {percentage}%
                          </span>
                          <span className={`text-xs ${subtleText}`}>
                            {complete}/{total || "—"} lessons
                          </span>
                        </div>

                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-[#7DF45F] to-[#2A27F3]"
                          />
                        </div>
                      </div>

                      {/* Duration + Rating */}
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="flex items-center gap-1 opacity-80">
                          <BsClock /> {course.duration || "—"}
                        </span>
                        <span className="flex items-center gap-1 opacity-80">
                          <BsStarFill /> {course.rating ?? "—"}
                        </span>
                      </div>

                      {/* Continue Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCourseProgress(course._id);
                        }}
                        className={`w-full mt-3 py-2 flex items-center ${isCompleted?"bg-green-700":"bg-[#2A27F3]"} justify-center gap-2 rounded-md font-semibold text-white transition hover:opacity-90`}
                       
                      >
                        {isCompleted && isCompleted === true ?<MdOutlineDoneAll/>:<FiPlayCircle />}
                        {isCompleted ? "Completed" : "Continue"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Student_Courses;
