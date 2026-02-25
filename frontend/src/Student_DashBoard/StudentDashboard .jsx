import { useDispatch, useSelector } from "react-redux";
import {
  FaBookOpen,
  FaClock,
  FaChartLine,
  FaStar,
  FaPlayCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { allCourses } from "../redux/actions/userCoursesAction.js";
import { toast } from "react-toastify";
import axios from "axios";
import { appDataContext } from "../Context/AppContext.jsx";

const StudentDashboard = () => {
  const { serverURL } = useContext(appDataContext);
  const user = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const allCourse = useSelector((state) => state.course.allCourses);
  const mode = useSelector((state) => state.app.mode);
  const navigate = useNavigate();
  const [activeCourses, setActiveCourses] = useState([]);
  const [achievement, setAchievement] = useState(0);
  const [overAllProgress, setOverAllProgress] = useState(0);

  useEffect(() => {
    if (!user?.courseProgress) return;

    const completedCount = user.courseProgress.filter(
      (c) => c.CourseCompleted === true
    ).length;
    setAchievement(completedCount);

    let stack = [];
    let totalcourse = user?.courseProgress.length;

    user?.courseProgress?.forEach((c) => {
      stack.push(c.overAllProgress);
    });

    let sum = stack.reduce((s, a) => s + a, 0);
    setOverAllProgress(totalcourse ? Math.round(sum / totalcourse) : 0);
  }, [user]);

  /* ===== Reusable Components ===== */

  const ProgressBar = ({ value }) => (
    <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
      <div
        className="bg-gradient-to-r from-[#2A27F3] to-[#A4FE6A] h-2 rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );

  const Button = ({
    children,
    variant = "primary",
    className = "",
    ...props
  }) => {
    const base =
      "px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 focus:outline-none";
    const hover =
      "transform hover:-translate-y-0.5 hover:scale-105 shadow-sm hover:shadow-lg";

    const styles =
      variant === "primary"
        ? mode
          ? "bg-gradient-to-r from-[#2A27F3] to-[#7EE787] text-white"
          : "bg-[#2A27F3] text-white"
        : variant === "secondary"
        ? mode
          ? "bg-transparent text-white/90 border border-white/20 hover:bg-white/5"
          : "bg-white text-[#2A27F3] border border-[#2A27F3] hover:bg-gray-100"
        : mode
        ? "border border-gray-600 text-gray-300 hover:bg-white/5"
        : "border border-gray-400 text-gray-700 hover:bg-gray-200";

    return (
      <button className={`${base} ${styles} ${hover} ${className}`} {...props}>
        {children}
      </button>
    );
  };

  // const active Course:
  useEffect(() => {
    dispatch(allCourses());
  }, [dispatch]);

  useEffect(() => {
    allEnrolledCourses();
  }, [allCourse]);

  const allEnrolledCourses = async () => {
    try {
      const result = await axios.post(
        serverURL + "/api/enroll/user-enroll-courses",
        {},
        { withCredentials: true }
      );
      if (result) {
        setActiveCourses(result.data);
      }
    } catch (error) {
      console.error("fetch enrolled courses error:", error);
      const msg = error?.response?.data || "Failed to load courses.";
      toast.error(msg);
    }
  };

 const courseDetails = (courseId) => {
  try {
    if (!Array.isArray(user?.courseProgress)) {
      return { complete: 0 };
    }

    const result = user.courseProgress.find(
      (p) => String(p.course) === String(courseId)
    );

    if (!result?.sections) {
      return { complete: 0 };
    }

    let complete = 0;

    result.sections.forEach((s) => {
      if (Array.isArray(s.completedLessons)) {
        complete += s.completedLessons.length;
      }
    });

    return { complete };
  } catch (e) {
    return { complete: 0 };
  }
};


  return (
    <div
      className={`h-screen overflow-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 font-Nunito transition-colors duration-300 ${
        mode ? "bg-black text-gray-200" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* ===== HEADER ===== */}
      <div
        className={`relative overflow-hidden rounded-2xl mb-10 p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:gap-0 justify-between items-center shadow-lg ${
          mode
            ? "bg-gradient-to-r from-[#1C1F40] to-[#2A27F3]"
            : "bg-gradient-to-r from-[#2A27F3] to-[#A4FE6A]"
        }`}
      >
        <div className="z-10 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
            Hey {user?.username || "Learner"} 👋
          </h2>
          <p className="text-white/90 mt-2 text-sm sm:text-lg">
            Keep learning and stay consistent — you're doing great!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 justify-center md:justify-start">
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => navigate("/student/courses")}
            >
              Continue Learning
            </Button>
            <Button
              variant="primary"
              className="w-full sm:w-auto"
              onClick={() => navigate("/Courses")}
            >
              View All Courses
            </Button>
          </div>
        </div>

        <img
          src="/dashboard.png"
          alt="Student Illustration"
          className="hidden sm:block md:static h-[12rem] sm:h-[14rem] md:h-[16rem] object-contain drop-shadow-lg opacity-90"
        />
      </div>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
        {[
          {
            title: "Courses Enrolled",
            value: user?.enrolledCourses?.length || 0,
            icon: <FaBookOpen />,
          },
          { title: "Hours Spent", value: "24h", icon: <FaClock /> },
          {
            title: "Avg. Progress",
            value: `${overAllProgress}%`,
            icon: <FaChartLine />,
          },
          { title: "Achievements", value: achievement, icon: <FaStar /> },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`p-4 sm:p-6 rounded-2xl flex flex-col items-center shadow-md transition hover:scale-[1.02] ${
              mode ? "bg-[#1F2024]" : "bg-white"
            }`}
          >
            <div className="text-[#2A27F3] mb-3 text-xl">{item.icon}</div>
            <h3 className="text-xl sm:text-2xl font-extrabold">{item.value}</h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              {item.title}
            </p>
          </div>
        ))}
      </div>

      {/* ===== ACTIVE COURSES ===== */}
      <section className="mb-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">
          🎯 Your Active Courses
        </h2>

        <div className="grid overflow-x-auto grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

          {activeCourses.map((course, idx) => {
            let lessons = 0
            if(course.sections && course.sections.length !== 0){
              course.sections.map((s)=>{
                if(s.lessons && s.lessons.length !== 0){
                  lessons += s.lessons.length
                }
              })
            }
            let {complete} = courseDetails(course._id)
            let percentage = lessons > 0 ? Math.round((complete / lessons) * 100) : 0;

            let status;
            if(percentage == 0){
              status = "Not started yet"
            }else if(percentage>1 && percentage<20){
              status="Just getting started"
            }else if(percentage>21 &&  percentage<40){
              status= "Making progress"
            }else if(percentage>41 &&  percentage<60){
              status= "Halfway there"
            }else if(percentage>61 &&  percentage<80){
              status= "More than halfway"
            }else if(percentage>81 && percentage<100){
              status= "Almost done"
            }else if(percentage === 100){
              status="Completed"
            }
            
            return (
              <div
                key={idx}
                className={`p-5 sm:p-6 rounded-2xl shadow-lg flex flex-col gap-4 hover:shadow-xl transition ${
                  mode ? "bg-[#1F2024]" : "bg-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={course.coverImage.url}
                    alt={course.title}
                    className="rounded-lg h-16 w-16 sm:h-20 sm:w-20 object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-base sm:text-lg">
                      {course.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {lessons} Lessons
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm font-medium">
                  <span
                    className="text-blue-500"
                  >
                    {status}
                  </span>
                  <span>{percentage}%</span>
                </div>

                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-[#7DF45F] to-[#2A27F3]"
                          />
                        </div>

                <Button
                onClick={()=>percentage !== 100 && navigate(`/class/${course._id}`)}
                className="flex items-center justify-center gap-2 mt-2 w-full">
                  {percentage !==100 && <FaPlayCircle size={16} />}
                  {percentage === 100 ?"done":"continue"}
                </Button>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default StudentDashboard;
