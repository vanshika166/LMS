import{ useContext, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FiUsers, FiBookOpen, FiTrendingUp } from "react-icons/fi";
import { useSelector } from "react-redux";
import axios from "axios";
import { appDataContext } from "../Context/AppContext.jsx";

const AnalyticsPage = () => {
  const { serverURL } = useContext(appDataContext);
  const mode = useSelector((state) => state.app.mode);
  const [totalStudents, setTotalStudents] = useState(0);
  const user = useSelector((state) => state.user.userData);
  const [courses, setCourses] = useState(null);
  const [courseData, setcourseData] = useState([
    { name: "Completed", value: 0, color: "#22c55e" },
    { name: "In Progress", value: 0, color: "#3b82f6" },
    { name: "Drafts", value: 0, color: "#f59e0b" },
  ]);

  useEffect(() => {
    getStudentCount();
    educatorCourses();
  }, []);

  useEffect(() => {
    let completed = 0;
    let inProgress = 0;
    let draft = 0;

    if (courses && courses.length) {
      courses.forEach((c) => {
        if (c.isPublished) {
          completed++;
        } else {
          draft++;
          inProgress++;
        }
      });
    }

    setcourseData([
      { name: "Completed", value: completed, color: "#22c55e" },
      { name: "In Progress", value: inProgress, color: "#3b82f6" },
      { name: "Drafts", value: draft, color: "#f59e0b" },
    ]);
  }, [courses]);

  /*  Monthly Enrollments */
  const enrollmentsData = [
    { month: "Jan", students: 40 },
    { month: "Feb", students: 60 },
    { month: "Mar", students: 80 },
    { month: "Apr", students: 65 },
    { month: "May", students: 100 },
    { month: "Jun", students: 120 },
  ];

  /* Monthly Revenue */
  const revenueData = [
    { month: "Jan", revenue: 200 },
    { month: "Feb", revenue: 400 },
    { month: "Mar", revenue: 600 },
    { month: "Apr", revenue: 550 },
    { month: "May", revenue: 700 },
    { month: "Jun", revenue: 850 },
  ];

  // course data:
  const educatorCourses = async () => {
    try {
      const res = await axios.post(
        `${serverURL}/api/course/all-courses`,
        {},
        { withCredentials: true }
      );
      console.log(res.data.courseCreated);
      setCourses(res.data.courseCreated);
    } catch (err) {
      console.log(err);
    }
  };

  // fucntion to get totalstudents:
  const getStudentCount = async () => {
    try {
      const result = await axios.post(
        serverURL + "/api/enroll/all-student",
        {},
        { withCredentials: true }
      );
      if (result) {
        console.log(result.data);
        setTotalStudents(result.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={`h-screen w-full overflow-auto p-4 sm:p-6 ${
        mode ? "bg-black text-white" : "bg-[#F6F5F8] text-black"
      }`}
    >
      {/* 🔹 Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          Analytics Overview
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Platform performance & growth insights
        </p>
      </div>

      {/* 🔹 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[
          {
            icon: <FiUsers className="text-blue-500 text-3xl" />,
            label: "Total Students",
            value: `${totalStudents}`,
          },
          {
            icon: <FiBookOpen className="text-green-500 text-3xl" />,
            label: "Total Courses",
            value: `${user?.courseCreated ? user.courseCreated.length : 0}`,
          },
          {
            icon: <FiTrendingUp className="text-purple-500 text-3xl" />,
            label: "Monthly Growth",
            value: "+18%",
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`${
              mode ? "bg-[#1F2024]" : "bg-white"
            } rounded-xl p-5 sm:p-6 shadow-md flex items-center gap-4`}
          >
            {item.icon}
            <div>
              <p className="text-sm text-gray-400">{item.label}</p>
              <h2 className="text-2xl font-bold">{item.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 💰 Revenue Trend */}
        <div
          className={`${
            mode ? "bg-[#1F2024]" : "bg-white"
          } rounded-xl shadow-md p-4 sm:p-6`}
        >
          <h3 className="text-lg font-semibold mb-1">Revenue Trend</h3>
          <p className="text-sm text-gray-400 mb-4">
            Monthly earnings overview
          </p>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 👥 Enrollments */}
        <div
          className={`${
            mode ? "bg-[#1F2024]" : "bg-white"
          } rounded-xl shadow-md p-4 sm:p-6`}
        >
          <h3 className="text-lg font-semibold mb-1">Student Enrollments</h3>
          <p className="text-sm text-gray-400 mb-4">
            New student signups per month
          </p>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={enrollmentsData}>
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="students" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 📚 Course Distribution */}
        <div
          className={`${
            mode ? "bg-[#1F2024]" : "bg-white"
          } rounded-xl shadow-md p-4 sm:p-6 lg:col-span-2`}
        >
          <h3 className="text-lg font-semibold mb-1 text-center">
            Course Distribution
          </h3>
          <p className="text-sm text-gray-400 mb-6 text-center">
            Status of all created courses
          </p>

          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={courseData}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {courseData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Text */}
            <div className="text-center -mt-40">
              <p className="text-3xl font-bold">
                {user?.courseCreated ? user.courseCreated.length : 0}
              </p>
              <p className="text-xs text-gray-400">TOTAL COURSES</p>
            </div>

            {/* Legend */}
            <div className="flex gap-6 mt-24">
              {courseData.map((course, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: course.color }}
                  />
                  <p className="text-sm">{course.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
