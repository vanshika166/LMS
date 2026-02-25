import { useDispatch, useSelector } from "react-redux";
import { getUserCourses } from "../redux/actions/userCoursesAction.js";
import {
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiCreditCard,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useEffect } from "react";

const TeacherEarnings = () => {
  const mode = useSelector((state) => state.app.mode);
   const dispatch = useDispatch();

  const userCourses = useSelector(
    (state) => state.userCourseData.userCourseData
  );

  useEffect(() => {
    dispatch(getUserCourses());
  }, [dispatch]);

  console.log(userCourses)
  

  const courseEarningsData = [
    { course: "React Basics", earnings: 19880 },
    { course: "Node Mastery", earnings: 14200 },
    { course: "MERN Bootcamp", earnings: 21250 },
    { course: "UI/UX Design", earnings: 6950 },
  ];

  return (
    <div
      className={`h-screen overflow-auto px-4 sm:px-6 py-6 ${
        mode ? "bg-black text-white" : "bg-[#F6F5F8] text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* PAGE HEADER */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Earnings Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Track your course performance and payouts
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              title: "Total Earnings",
              value: "₹48,250",
              icon: <FiDollarSign />,
            },
            { title: "This Month", value: "₹6,300", icon: <FiTrendingUp /> },
            { title: "Total Students", value: "214", icon: <FiUsers /> },
            {
              title: "Available Balance",
              value: "₹4,200",
              icon: <FiCreditCard />,
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl shadow-md flex items-center justify-between ${
                mode ? "bg-[#1F2024]" : "bg-white"
              }`}
            >
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <h2 className="text-xl font-semibold mt-1">{card.value}</h2>
              </div>
              <div className="text-indigo-500 text-2xl">{card.icon}</div>
            </div>
          ))}
        </div>

        {/* EARNINGS GRAPH – Course-wise Earnings */}
        <div
          className={`p-6 rounded-2xl shadow-md ${
            mode ? "bg-[#1F2024]" : "bg-white"
          }`}
        >
          <h2 className="font-semibold mb-4">Earnings by Course</h2>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={courseEarningsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="course" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, "Earnings"]} />
              <Bar dataKey="earnings" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* COURSE WISE EARNINGS */}
        <div
          className={`p-6 rounded-2xl shadow-md ${
            mode ? "bg-[#1F2024]" : "bg-white"
          }`}
        >
          <h2 className="font-semibold mb-4">Course-wise Earnings</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Course</th>
                  <th>Price</th>
                  <th>Students</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {userCourses?.map(
                  (course) => (
                    <tr key={course?._id}>
                      <td className="py-3">{course.title}</td>
                      <td>{course?.price}</td>
                      <td>{course?.enrolledStudents.length}</td>
                      <td className="font-semibold">₹1,19,880</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RECENT TRANSACTIONS + WALLET */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* TRANSACTIONS */}
          <div
            className={`lg:col-span-2 p-6 rounded-2xl shadow-md ${
              mode ? "bg-[#1F2024]" : "bg-white"
            }`}
          >
            <h2 className="font-semibold mb-4">Recent Transactions</h2>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border p-3 rounded-lg"
                >
                  <div>
                    <p className="font-medium">React Basics</p>
                    <p className="text-xs text-gray-500">12 Sept 2025</p>
                  </div>
                  <div className="text-green-500 font-semibold">+ ₹899</div>
                </div>
              ))}
            </div>
          </div>

          {/* WALLET */}
          <div
            className={`p-6 rounded-2xl shadow-md ${
              mode ? "bg-[#1F2024]" : "bg-white"
            }`}
          >
            <h2 className="font-semibold mb-4">Wallet</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Available</span>
                <span className="font-semibold text-green-500">₹4,200</span>
              </div>
              <div className="flex justify-between">
                <span>Pending</span>
                <span className="font-semibold text-yellow-500">₹1,100</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Next Payout</span>
                <span>28 Sept</span>
              </div>
            </div>

            <button className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition">
              Withdraw Earnings
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default TeacherEarnings;
