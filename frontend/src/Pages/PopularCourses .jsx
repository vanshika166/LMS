import { useDispatch, useSelector } from "react-redux";
import { allCourses } from "../redux/actions/userCoursesAction.js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PopularCourses = () => {
  const mode = useSelector((state) => state.app.mode);
  const allcourse = useSelector((state) => state.course.allCourses);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(allCourses());
  }, [dispatch]);

  return (
    <div
      className={`min-h-screen ${mode ? "bg-black" : "bg-[#F6F5F8]"} py-20 px-6`}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className={`text-4xl font-Nunito font-extrabold ${mode ? "text-white" : "text-gray-900"} text-center mb-14 tracking-tight`}
        >
          Explore Popular Courses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {allcourse?.slice(0, 4).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};

const CourseCard = ({ course }) => {
  const mode = useSelector((state) => state.app.mode);
  const navigate = useNavigate()

  return (
    <div
      className={`relative ${mode ? "bg-[#1F2024]" : "bg-white border-gray-100"} rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group border `}
    >
      {/* image div */}
      <div className="relative">
        <img
          src={course?.coverImage?.url}
          alt={course?.title}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 bg-[#A4FE6A] text-black text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          {course?.level}
        </div>
      </div>

      {/* course details */}
      <div className="p-6">
        <h3
          className={`text-xl font-bold font-Nunito ${mode ? "text-white" : "text-gray-900"}  mb-2 line-clamp-2`}
        >
          {course?.title}
        </h3>
        <p
          className={`${mode ? "text-gray-300" : "text-gray-600"} text-sm mb-3`}
        >
          By {course?.educator?.username}
        </p>

        <div className="flex justify-between mb-5 text-sm">
          <span
            className={`flex items-center gap-1 ${mode ? "text-gray-300" : "text-gray-700"}`}
          >
            <svg
              className="w-5 h-5 text-[#2A27F3]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {course.duration}
          </span>
          <span
            className={`flex items-center gap-1 ${mode ? "text-gray-300" : "text-gray-700"}`}
          >
            <svg
              className="w-5 h-5 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.357-2.44a1 1 0 00-1.175 0l-3.357 2.44c-.784.57-1.838-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.314 8.397c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.97z" />
            </svg>
            {course?.isFree? "Enroll free":course.price}
          </span>
        </div>

        <button
        onClick={() => navigate(`/course-detail/${course?._id}`)}
        className="w-full bg-[#2A27F3] text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:bg-[#201bd1] shadow-md">
          Enroll Now
        </button>
      </div>
    </div>
  );
};

export default PopularCourses;
