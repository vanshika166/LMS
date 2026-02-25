import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getCurrrentCourse } from "../redux/actions/userCoursesAction.js";
import { appDataContext } from "../Context/AppContext.jsx";

const PublishPage = () => {
  const [agree, setAgree] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const currentCourse = useSelector((state) => state.course.getCurrentCourse);
  const mode = useSelector((state) => state.app.mode);

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { serverURL } = useContext(appDataContext);

  // Load course details
  useEffect(() => {
    if (id) {
      dispatch(getCurrrentCourse(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentCourse && currentCourse.title) {
      console.log("Current course:", currentCourse);
    }
  }, [currentCourse]);

  // Price calculation
  const originalPrice = currentCourse?.price || 0;
  const discountPercent = currentCourse?.discount || 0;
  const finalPrice =
    discountPercent > 0
      ? originalPrice - (originalPrice * discountPercent) / 100
      : originalPrice;

  // ✅ Publish Course
  const publishCourse = async () => {
    try {
      const result = await axios.post(
        `${serverURL}/api/course/course-publish`,
        { id, isPublished: true },
        { withCredentials: true }
      );

      if (result) {
        toast.success("Course Published Successfully!");
        navigate("/teacher/dashboard");
      }
    } catch (error) {
      console.log("Publish course error:", error);
      toast.error(error.response?.data?.message || "Failed to publish course.");
    }
  };

  // ✅ Draft Course
  const draftCourse = async () => {
    try {
      const result = await axios.post(
        `${serverURL}/api/course/course-publish`,
        { id, isPublished: false },
        { withCredentials: true }
      );

      if (result) {
        toast.success("Course saved as Draft!");
        navigate("/teacher/dashboard");
      }
    } catch (error) {
      console.log("Draft course error:", error);
      toast.error(error.response?.data?.message || "Failed to save draft.");
    }
  };

  return (
    <div
      className={`h-screen overflow-auto ${
        mode
          ? "bg-black"
          : "bg-[#F6F5F8]"
      } relative`}
    >

      <div className="max-w-5xl mx-auto mt-10 p-8 space-y-10">
        {/* Header */}
        <header className="border-b pb-4">
          <h1
            className={`text-3xl font-bold ${
              mode ? "text-white" : "text-black"
            }`}
          >
            Final Review & Publish 🚀
          </h1>
          <p
            className={`text-sm ${
              mode ? "text-gray-300" : "text-gray-500"
            } mt-1`}
          >
            Double-check all your details before making your course live
          </p>
        </header>

        {/* Course Info */}
        <section className="space-y-3">
          <h2
            className={`text-lg font-semibold ${
              mode ? "text-white" : "text-gray-700"
            }`}
          >
            Course Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div
              className={`p-5 rounded-xl ${
                mode ? "bg-[#1F2024]" : "bg-white"
              } shadow-md hover:shadow-lg transition`}
            >
              <p
                className={`font-medium ${
                  mode ? "text-white" : "text-gray-800"
                }`}
              >
                Title
              </p>
              <p className={`${mode ? "text-gray-300" : "text-gray-600"}`}>
                {currentCourse?.title || "Loading..."}
              </p>
            </div>

            <div
              className={`p-5 rounded-xl ${
                mode ? "bg-[#1F2024]" : "bg-white"
              } shadow-md hover:shadow-lg transition`}
            >
              <p
                className={`font-medium ${
                  mode ? "text-white" : "text-gray-800"
                }`}
              >
                Price
              </p>
              {currentCourse?.isFree && currentCourse?.isFree === true ? (
                <p className=" text-lg text-green-500">This course is free.</p>
              ) : (
                <p className={`${mode ? "text-gray-300" : "text-gray-600"}`}>
                  ₹{finalPrice}{" "}
                  {discountPercent > 0 && (
                    <>
                      <span className="line-through text-gray-400 ml-2">
                        ₹{originalPrice}
                      </span>{" "}
                      <span className="text-red-500 text-sm">
                        ({discountPercent}% OFF)
                      </span>
                    </>
                  )}
                </p>
              )}
            </div>

            <div
              className={`md:col-span-2 p-5 rounded-xl ${
                mode ? "bg-[#1F2024]" : "bg-white"
              } shadow-md hover:shadow-lg transition`}
            >
              <p
                className={`font-medium ${
                  mode ? "text-white" : "text-gray-800"
                }`}
              >
                Description
              </p>
              <p className={`${mode ? "text-gray-300" : "text-gray-600"}`}>
                {currentCourse?.description || "No description available."}
              </p>
            </div>
          </div>
        </section>

        {/* Media Preview */}
        <section>
          <h2
            className={`text-lg font-semibold ${
              mode ? "text-white" : "text-gray-700"
            }`}
          >
            Media Preview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cover Image */}
            <div className="space-y-2">
              <p
                className={`text-sm font-medium ${
                  mode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Cover Image
              </p>
              <div className="overflow-hidden rounded-xl shadow-md group">
                <img
                  src={currentCourse?.coverImage?.url}
                  alt="Cover Image"
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition duration-300"
                />
              </div>
            </div>

            {/* Cover Video */}
            <div className="space-y-2">
              <p
                className={`text-sm font-medium ${
                  mode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Sales Video
              </p>
              <div className="overflow-hidden rounded-xl shadow-md group">
                {currentCourse?.coverVideo?.url ? (
                  <video
                    className="w-full h-48 object-cover"
                    controls
                    src={currentCourse?.coverVideo?.url}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div
                    className={`w-full h-48 flex items-center justify-center ${
                      mode ? "bg-[#1F2024]" : "bg-gray-100"
                    }`}
                  >
                    <p className="text-gray-500">No video uploaded</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Agreement */}
        <section
          className={`flex items-center gap-3 p-4 rounded-xl ${
            mode ? "bg-[#1F2024]" : "bg-gradient-to-r from-indigo-50 to-pink-50"
          } border`}
        >
          <button
            onClick={() => setAgree(!agree)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
              agree ? "bg-indigo-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition ${
                agree ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </button>
          <p className={`text-sm ${mode ? "text-gray-300" : "text-gray-600"}`}>
            I agree to the platform’s{" "}
            <a href="#" className="text-indigo-500 font-medium underline">
              terms & conditions
            </a>
          </p>
        </section>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4 pt-4">
  <button
    onClick={() => navigate(`/course-detail/${id}`)}
    className="w-full sm:w-auto bg-[#2A27F3] font-semibold text-white hover:bg-[#0c09b5] transition-all duration-300 px-5 py-2 rounded-md font-Nunito"
  >
    Preview
  </button>

  <button
    onClick={draftCourse}
    className="w-full sm:w-auto px-5 py-2 rounded-md border text-gray-600 hover:bg-gray-100 transition"
  >
    Save as Draft
  </button>

  <button
    onClick={publishCourse}
    disabled={!agree}
    className={`w-full sm:w-auto px-6 py-2 rounded-md font-medium shadow-lg transition ${
      agree
        ? "bg-[#2A27F3] text-white hover:bg-[#0c09b5]"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
  >
    Publish Course
  </button>
</div>

      </div>
    </div>
  );
};

export default PublishPage;
