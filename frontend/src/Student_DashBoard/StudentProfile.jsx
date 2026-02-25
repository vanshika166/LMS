import axios from "axios";
import React, { useContext, useState } from "react";
import { FiEdit2, FiLogOut, FiCheck, FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setUserData } from "../redux/userSlice.js";
import { appDataContext } from "../Context/AppContext.jsx";

const StudentProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const mode = useSelector((state) => state.app.mode);

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [description, setDescription] = useState(user?.description || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");

  const navigate = useNavigate();
  const { serverURL } = useContext(appDataContext);

  // update profile
  const handleUpdateProfile = async () => {
    setIsEditing(false);
    const formData = new FormData();
    formData.append("username", username);
    formData.append("description", description);
    formData.append("photoURL", photoURL);

    try {
      const result = await axios.post(
        serverURL + "/api/user/profile",
        formData,
        { withCredentials: true }
      );
      if (result.data) {
        dispatch(setUserData(result.data));
        toast.success("Profile updated successfully.");
      }
    } catch (error) {
      console.log("Update profile error:", error);
    }
  };

  // logout
  const handleLogout = async () => {
    try {
      const result = await axios.get(serverURL + "/api/auth/logout", {
        withCredentials: true,
      });
      if (result) {
        dispatch(setUserData(null));
        navigate("/");
        toast.success("Logout successfully.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen overflow-y-auto flex items-center justify-center font-Nunito px-4 sm:px-6">
      <div className="w-full max-w-3xl rounded-2xl p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 border-b border-gray-200 pb-6 mb-8 text-center sm:text-left">
          <div className="relative">
            <img
              src={
                user?.photoURL.url ||
                "/profile.jpg"
              }
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-gray-200"
            />
            <label className="absolute bottom-0 right-0 bg-gray-800 p-2 rounded-full cursor-pointer hover:bg-gray-900 transition">
              <FiUpload className="text-white text-sm" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoURL(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <h2
              className={`text-xl sm:text-2xl font-semibold ${
                mode ? "text-white" : "text-gray-900"
              }`}
            >
              {user?.username}
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label
              className={`block text-sm ${
                mode ? "text-gray-200" : "text-gray-500"
              }`}
            >
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full mt-2 p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 ${
                  mode
                    ? "bg-[#1F2024] text-white"
                    : "bg-gray-50 text-black"
                }`}
              />
            ) : (
              <p
                className={`mt-2 p-2 text-sm sm:text-base border rounded-md ${
                  mode
                    ? "bg-[#1F2024] border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200 text-black"
                }`}
              >
                {user?.username}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-500">Email</label>
            <p
              className={`mt-2 p-2 text-sm sm:text-base border rounded-md ${
                mode
                  ? "bg-[#1F2024] border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-black"
              }`}
            >
              {user?.email}
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-500">Description</label>
            {isEditing ? (
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full mt-2 p-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 ${
                  mode
                    ? "bg-[#1F2024] text-white"
                    : "bg-gray-50 text-black"
                }`}
              />
            ) : (
              <p
                className={`mt-2 p-3 text-sm sm:text-base border rounded-md ${
                  mode
                    ? "bg-[#1F2024] border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200 text-black"
                }`}
              >
                {user?.description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-8 sm:mt-10">
          {isEditing ? (
            <button
              onClick={handleUpdateProfile}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-gray-800 text-white hover:bg-gray-900 transition rounded-lg"
            >
              <FiCheck /> Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition rounded-lg"
            >
              <FiEdit2 /> Edit Profile
            </button>
          )}

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-red-600 text-white hover:bg-red-700 transition rounded-lg"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
