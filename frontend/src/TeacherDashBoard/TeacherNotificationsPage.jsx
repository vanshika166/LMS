import React, { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiBell, FiUserPlus, FiStar,FiMessageSquare  } from "react-icons/fi";
import { HiOutlineCurrencyRupee  } from "react-icons/hi";
import { appDataContext } from "../Context/AppContext.jsx";
import {formatDistanceToNow} from 'date-fns'

const TeacherNotificationsPage = () => {
  const mode = useSelector((state) => state.app.mode);
  const user = useSelector((state) => state.user.userData);
  const { getNotifications, notifications } = useContext(appDataContext);
  console.log(user);
  useEffect(() => {
    getNotifications();
  }, []);

  const dateFormat = (date)=>{
    return formatDistanceToNow(new Date(date),{addSuffix:true});
  }

  return (
    <div
      className={`h-screen overflow-x-auto px-4 sm:px-8 py-8 transition-colors duration-300 ${
        mode ? "bg-black text-white" : "bg-[#F6F5F8] text-gray-800"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <FiBell size={26} />
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
      </div>

      {/* Tabs (UI Only) */}
      <div className="flex gap-6 mb-6 text-sm font-medium">
        <button className="border-b-2 border-[#2A27F3] pb-2">All</button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications &&
          notifications.length > 0 &&
          notifications.map((elem) => {
            return (
              <div
                key={elem._id}
                className={`flex gap-4 p-5 rounded-xl shadow-sm transition ${
                  mode
                    ? "bg-[#1F2024] hover:bg-[#2A2C31]"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="mt-1 text-[#2A27F3]">
                  {elem.type === "enrollement" ? <FiUserPlus size={20} /> 
                    : elem.type === "review" ? <FiMessageSquare size={20} /> 
                    : elem.type === "rating" ? <FiStar size={20} /> 
                    : elem.type === "payment" ? <HiOutlineCurrencyRupee size={20} /> 
                    : <FiUserPlus size={20} />}
                </div>

                <div className="flex-1">
                  <p className="font-semibold">{elem.message}</p>

                  <p
                    className={`text-sm mt-1 ${
                      mode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {dateFormat(elem?.createdAt)}
                  </p>
                </div>

                {!elem.isRead && (
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                )}
              </div>
            );
          })}
      </div>

      {/* Empty State */}
      <div
        className={`mt-12 text-center ${
          mode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        <p className="text-sm">You’re all caught up! 🎯</p>
      </div>
    </div>
  );
};

export default TeacherNotificationsPage;
