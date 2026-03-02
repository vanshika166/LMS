import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentBlog } from "../redux/actions/blogAction.js";

const BlogRead = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentBlog = useSelector((state) => state.userBlogs.currentBlog);
  const mode = useSelector((state) => state.app.mode); // true => dark

  useEffect(() => {
    if (id) dispatch(getCurrentBlog(id));
  }, [dispatch, id]);

  const formattedDate = currentBlog?.createdAt
    ? new Date(currentBlog.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "31 August 2025";

  if (!currentBlog) {
    return (
      <div
        className={`flex justify-center items-center min-h-screen text-xl font-medium ${
          mode
            ? "bg-[#1F2024] text-gray-200"
            : "bg-gradient-to-b from-blue-50 to-gray-100 text-blue-700"
        }`}
      >
        Loading blog details...
      </div>
    );
  }

  return (
    <>
      {/* Main Blog Container */}
      <div
        className={`min-h-screen py-20 px-5 flex flex-col items-center transition-all duration-300 ${
          mode ? "bg-black text-gray-200" : "bg-[#F6F5F8] text-gray-900"
        }`}
      >
        {/* Blog Card */}
        <div
          className={`w-full max-w-4xl overflow-hidden rounded-2xl transition-all duration-300 `}
        >
          {/* Blog Header */}
          <div className="px-2 pt-10 pb-4 text-center">
            <h1
              className={`text-4xl font-bold leading-snug font-Nunito ${
                mode ? "text-white" : "text-gray-900"
              }`}
            >
              {currentBlog?.title}
            </h1>

            <p
              className={`text-sm mt-4 flex justify-center items-center gap-2 ${
                mode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <img
                src={currentBlog?.creator?.photoURL?.url || "/default-avatar.png"}
                alt={currentBlog?.creator?.username}
                className="w-8 h-8 rounded-full object-cover border border-blue-200"
              />
              <span className="font-medium">
                {currentBlog?.creator?.username}
              </span>
              <span>•</span>
              <span>{formattedDate}</span>
            </p>

            <div className="flex justify-center gap-3 mt-3">
              {["LMS", "EdTech", "Web Development"].map((tag, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 text-sm rounded-full font-medium ${
                    mode
                      ? "bg-blue-900/30 text-blue-300"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Blog Image */}
          {currentBlog?.image && (
            <div className="mt-6 w-full flex justify-center">
              <img
                src={currentBlog.image.url}
                alt={currentBlog.title}
                className="w-full h-[25rem] max-w-3xl rounded-2xl object-cover shadow-md"
              />
            </div>
          )}

          {/* Blog Content */}
          <div className="px-8 py-10">
            <div
              className={`prose prose-lg max-w-none leading-8 ${
                mode ? "prose-invert text-gray-300" : "text-gray-700"
              }`}
            >
              <p className="whitespace-pre-line">{currentBlog?.content}</p>
            </div>
          </div>

          {/* Author Section */}
          <div
            className={`border-t px-8 py-8 ${
              mode
                ? "border-gray-700 bg-[#1F2024]"
                : "border-gray-100 bg-blue-50/30"
            }`}
          >
            <div className="flex items-center gap-5">
              <img
                src={currentBlog?.creator?.photoURL?.url || "/default-avatar.png"}
                alt={currentBlog?.creator?.username}
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-300"
              />
              <div>
                <h3
                  className={`text-xl font-semibold ${
                    mode ? "text-blue-400" : "text-blue-800"
                  }`}
                >
                  {currentBlog?.creator?.username}
                </h3>
                <p
                  className={`text-sm ${
                    mode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {currentBlog?.creator?.headline ||
                    "Educator • MERN Developer • Mentor"}
                </p>
              </div>
            </div>
            <p
              className={`mt-4 leading-relaxed ${
                mode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {currentBlog?.creator?.description}
            </p>
          </div>

          {/* Back Button */}
          <div className="text-center py-10">
            <button
              onClick={() => navigate("/blog")}
              className={`px-8 py-3 font-semibold rounded-xl shadow-md transition-all duration-300 ${
                mode
                  ? "bg-[#2A27F3] text-white hover:bg-[#4442e6] hover:scale-105"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
              }`}
            >
              ← Back to Blogs
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogRead;
