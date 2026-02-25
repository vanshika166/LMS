import React, { useContext, useEffect } from "react";
import { FiUsers, FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserCourses,
  handleEditState,
} from "../redux/actions/userCoursesAction.js";
import { SlBookOpen } from "react-icons/sl";
import { appDataContext } from "../Context/AppContext.jsx";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";

const CoursesPage = () => {
  const mode = useSelector((state) => state.app.mode);
  const userCourses = useSelector(
    (state) => state.userCourseData.userCourseData
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { serverURL } = useContext(appDataContext);

  useEffect(() => {
    dispatch(getUserCourses());
  }, [dispatch]);

  const deleteCourse = async (id) => {
    try {
      const result = await axios.post(
        `${serverURL}/api/course/delete-course`,
        { id },
        { withCredentials: true }
      );
      if (result) toast.success("Course deleted successfully.");
    } catch (error) {
      toast.error(error?.response?.message || "Something went wrong");
    }
  };

  return (
    <div className="h-screen w-full overflow-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1
          className={`text-2xl font-semibold ${
            mode ? "text-white" : "text-gray-800"
          }`}
        >
          My Courses
        </h1>

        {userCourses?.length > 0 && (
          <button
            onClick={() => navigate("/teacher/create-course")}
            className="bg-[#2A27F3] text-white font-semibold px-5 py-2 rounded-md hover:bg-[#0c09b5] transition-all duration-300 w-full sm:w-auto"
          >
            + Create New Course
          </button>
        )}
      </div>

      {/* Courses Grid */}
      {userCourses?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCourses.map((course) => (
            <div
              key={course._id}
              className={`relative flex flex-col overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                mode ? "bg-[#1F2024] text-white" : "bg-white text-gray-800"
              }`}
            >
              {/* Status Badge */}
              <span
                className={`absolute left-3 top-3 px-3 py-1 text-xs font-semibold rounded-full ${
                  course.isPublished
                    ? "bg-green-400 text-black"
                    : "bg-gray-400 text-white"
                }`}
              >
                {course.isPublished ? "Published" : "In Progress"}
              </span>

              {/* Thumbnail */}
              <div className="w-full h-40 overflow-hidden">
                <img
                  src={course.coverImage.url}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Card Content */}
              <div className="flex flex-col flex-1 justify-between p-4 space-y-3">
                <h2
                  onClick={() => navigate(`/course-detail/${course._id}`)}
                  className="text-lg font-semibold hover:text-blue-500 transition-colors cursor-pointer"
                >
                  {course.title}
                </h2>

                <div
                  className={`flex justify-between text-sm ${
                    mode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FiUsers />
                    <span>{course.enrolledStudents?.length || 0} Students</span>
                  </div>
                  <span>{course.sections?.length || 0} Modules</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(handleEditState(true));
                      navigate(`/teacher/create-course/${course._id}`);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg hover:opacity-90 transition"
                  >
                    <FiEdit /> Manage
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCourse(course._id);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    <MdDelete /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center py-20">
          <SlBookOpen className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Ready to Start Teaching?
          </h2>
          <p className="text-gray-500 max-w-md mb-6">
            Create your first course and share your knowledge with students
            worldwide.
          </p>
          <button
            onClick={() => navigate("/teacher/create-course")}
            className="bg-[#2A27F3] text-white font-semibold px-6 py-2 rounded-md hover:bg-[#0c09b5] transition"
          >
            + Create Your First Course
          </button>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
