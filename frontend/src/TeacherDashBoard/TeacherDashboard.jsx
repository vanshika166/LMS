import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

import { useDispatch, useSelector } from "react-redux";
import { getUserCourses } from "../redux/actions/userCoursesAction.js";

const TeacherDashboard = () => {
  const mode = useSelector((state) => state.app.mode);
  const dispatch = useDispatch();

  const userCourses = useSelector(
    (state) => state.userCourseData.userCourseData
  );

  const [published, setPublished] = useState(0);
  const [draft, setDraft] = useState(0);

  useEffect(() => {
    dispatch(getUserCourses());
  }, [dispatch]);

  useEffect(() => {
    if (userCourses?.length) {
      let pub = 0;
      let dr = 0;

      userCourses.forEach((course) => {
        course.isPublished ? pub++ : dr++;
      });

      setPublished(pub);
      setDraft(dr);
    } else {
      setPublished(0);
      setDraft(0);
    }
  }, [userCourses]);

  /* 🔹 Graph 1: Course Status */
  const courseStatusData = [
    { name: "Published", value: published, color: "#22c55e" },
    { name: "Draft", value: draft, color: "#f59e0b" },
    {
      name: "Total",
      value: published + draft,
      color: "#6366f1",
    },
  ];

  /* 🔹 Graph 2: Students per Course (Radar Chart) */
  const studentsRadarData =
    userCourses?.map((course) => ({
      course: course.title,
      students: course.enrolledStudents.length || 0,
    })) || [];

  return (
    <div
      className={`h-screen w-full overflow-auto p-4 sm:p-6 ${
        mode ? "text-white" : "text-black"
      }`}
    >
      {/* Greeting */}
      <div className="mb-6 sm:mb-8">
        <p className="text-gray-400 text-sm">Thursday, 20th February</p>
        <h1 className="text-2xl sm:text-3xl font-semibold">
          Good Evening! John
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {[
          { label: "Total Courses", value: published + draft },
          { label: "Published Courses", value: published },
          { label: "Draft Courses", value: draft },
        ].map((item, index) => (
          <div
            key={index}
            className={`${
              mode ? "bg-[#1F2024]" : "bg-gray-200"
            } p-5 sm:p-6 rounded-xl shadow-md text-center`}
          >
            <p className="text-gray-400 text-sm">{item.label}</p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* 🔹 GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Status Overview */}
        <div
          className={`${
            mode ? "bg-[#1F2024]" : "bg-gray-200"
          } p-4 sm:p-6 rounded-xl shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-4">Course Status Overview</h3>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={courseStatusData}
              layout="vertical"
              margin={{ left: 30 }}
            >
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#9ca3af"
                width={100}
              />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {courseStatusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🎯 Students per Course – Radar Chart */}
        <div
          className={`${
            mode ? "bg-[#1F2024]" : "bg-gray-200"
          } p-4 sm:p-6 rounded-xl shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-4">Students per Course</h3>

          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={studentsRadarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis
                dataKey="course"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <PolarRadiusAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
              <Radar
                name="Students"
                dataKey="students"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.5}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
