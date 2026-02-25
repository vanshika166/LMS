import React, { useContext, useState } from "react";
import { FaCheckCircle, FaStar } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import GenerateCertificate from "./GenerateCertificate.jsx";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { appDataContext } from "../Context/AppContext.jsx";
import { useSelector } from "react-redux";

const CourseCompletion = ({ onClose, courseTitle, userName }) => {
  const { serverURL } = useContext(appDataContext);
  const user = useSelector((state) => state.user.userData);
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [review, setReview] = useState(false)

  // function to add review:
  const addReview = async () => {
    console.log(id)
    try {
      const result = await axios.post(
        serverURL + "/api/review/add-review",
        { courseId:id, rating, comment },
        { withCredentials: true }
      );
      if (result) {
        console.log(result.data);
        toast.success("Review Submitted successfully.")
        onClose()
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {review?
      // review
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
        {/* Review Header */}
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Share your experience
        </h3>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Your feedback helps other students choose better 🚀
        </p>

        {/* Rating */}
        <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer text-2xl transition ${
                  rating >= star ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>

        {/* Review Textarea */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Write your review
          </label>
          <textarea
          onChange={(e)=>setComment(e.target.value)}
          value={comment}
            rows="4"
            placeholder="What did you like about this course? Was it easy to follow? Any suggestions?"
            className="w-full resize-none rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-4 text-gray-700 outline-none transition"
          />
          <p className="text-xs text-gray-400 mt-2">Minimum 20 characters</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
          onClick={()=>addReview()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300">
            Submit Review
          </button>

          <button
          onClick={()=>setReview(false)}
          className="w-full border border-gray-300 text-gray-600 hover:bg-gray-100 font-semibold py-3 rounded-xl transition">
            Skip for now
          </button>
        </div>
      </div>:

      // model
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
        >
          ×
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <FaCheckCircle className="text-green-600 text-5xl" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Course Completed 🎉
        </h2>

        {/* Text */}
        <p className="text-center text-gray-600 mb-6 leading-relaxed">
          <span className="font-semibold text-gray-800">{userName}</span>,
          you’ve successfully completed
          <br />
          <span className="font-bold text-blue-600">“{courseTitle}”</span>
        </p>

        {/* Rating Section */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-center text-gray-700 font-medium mb-3">
            Rate this course
          </p>

          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer text-2xl transition ${
                  rating >= star ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Certificate */}
          <GenerateCertificate
            button="Download Certificate"
            studentName={userName}
            courseName={courseTitle}
          />

          {/* Add Review */}
          <button
          onClick={()=>setReview(true)}
          className="flex items-center justify-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 rounded-lg px-4 py-3 font-semibold">
            <FiEdit3 />
            Add Review
          </button>
        </div>
      </div>}
      
    </div>
  );
};

export default CourseCompletion;
