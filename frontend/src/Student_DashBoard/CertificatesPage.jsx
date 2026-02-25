import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  FiAward,
  FiCalendar,
  FiStar,
  FiCheckCircle,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { appDataContext } from "../Context/AppContext.jsx";
import GenerateCertificate from "../Components/GenerateCertificate.jsx";

const CertificatesPage = () => {
  const mode = useSelector((state) => state.app.mode); // true = dark
  const { serverURL } = useContext(appDataContext);
  const user = useSelector((state) => state.user.userData);

  const [usercourses, setUserCourses] = useState(null);
  const [allCourses, setAllCourses] = useState(null);
  const [completedCourses, setCompletedCourses] = useState([]);

  // Theme classes — bilkul Student_Courses jaisa feel
  const containerBg = mode ? "bg-black text-white" : "bg-[#f7fafc] text-gray-900";
  const cardBg = mode ? "bg-white/5 border-white/10" : "bg-white border-gray-200";
  const textMuted = mode ? "text-gray-400" : "text-gray-600";
  const headingColor = mode ? "text-white" : "text-gray-900";
  const subtleBg = mode ? "bg-white/10" : "bg-gray-100";

  useEffect(() => {
    if (user && user.courseProgress) {
      setUserCourses(user.courseProgress);
    }
  }, [user]);

  // Fixed: dependency [usercourses] rakhi → no infinite loop
  useEffect(() => {
    if (usercourses && usercourses.length > 0) {
      const completed = usercourses.filter(c => c.CourseCompleted === true);
      setCompletedCourses(completed);
    }
  }, [usercourses]);

  useEffect(() => {
    allEnrolledCourses();
  }, []);

  const allEnrolledCourses = async () => {
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
      toast.error("Failed to load courses.");
    }
  };

  const finalCourses = (id) => {
    if (!allCourses) return { title: "Loading...", coverImage: "", educator: "..." };
    const course = allCourses.find(c => c._id === id);
    return {
      title: course?.title || "Unknown Course",
      coverImage: course?.coverImage?.url || "/course-placeholder.png",
      educator: course?.educator?.username || "Unknown Instructor"
    };
  };

  return (
    <div className={`h-screen overflow-auto ${containerBg} transition-all duration-500`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className={`text-4xl md:text-5xl font-bold ${headingColor}`}>
          My Certificates
        </h1>
        <p className={`mt-4 text-xl ${textMuted}`}>
          You have earned{" "}
          <span className="text-yellow-400 font-bold text-3xl">
            {completedCourses.length}
          </span>{" "}
          certificate{completedCourses.length !== 1 && "s"}{" "}
          <FiStar className="inline ml-2 text-yellow-400" />
        </p>
      </div>

      {/* Certificates Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {completedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {completedCourses.map((cert) => {
              const { title, coverImage, educator } = finalCourses(cert.course);

              return (
                <div
                  key={cert.course}
                  className={`group rounded-2xl overflow-hidden border ${cardBg} shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3`}
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={coverImage}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                      <FiCheckCircle className="h-4 w-4" />
                      Completed
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-5">
                    <div>
                      <h3 className={`text-xl font-bold ${headingColor} line-clamp-2`}>
                        {title}
                      </h3>
                      <p className={`text-sm mt-2 ${textMuted}`}>
                        by {educator}
                      </p>
                    </div>

                    <div className="flex items-center gap-8 text-sm">
                      <span className="flex items-center gap-2 text-yellow-400 font-medium">
                        <FiStar className="h-5 w-5" />
                        100%
                      </span>
                      <span className={`flex items-center gap-2 ${textMuted}`}>
                        <FiCalendar className="h-5 w-5" />
                        {new Date().toLocaleDateString("en-GB")}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <GenerateCertificate
                        button="Download Your Certificate"
                        studentName={user?.username || "Student"}
                        courseName={title}
                        courseId={cert.course}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-32">
            <FiAward className={`mx-auto h-32 w-32 ${textMuted} mb-8 opacity-50`} />
            <h3 className={`text-3xl font-bold ${textMuted}`}>
              No certificates yet
            </h3>
            <p className={`mt-4 text-lg ${textMuted}`}>
              Complete courses to unlock your achievements!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificatesPage;