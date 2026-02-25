import React, { useContext, useEffect, useState } from "react";
import { FaStar, FaReply } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import axios from "axios";
import { appDataContext } from "../Context/AppContext.jsx";
import { toast } from "react-toastify";

const InstructorReviews = () => {
  const mode = useSelector((state) => state.app.mode);
  const { serverURL } = useContext(appDataContext);
  const [reply, setReply] = useState("");
  const [reviews, setReviews] = useState(null);
  const [average, setAverage] = useState(0);
  const [fiveStarReviews, setFiveStarReviews] = useState(0);
  const [activeReply, setActiveReply] = useState(null); // UI only

  useEffect(() => {
    getAllreviews();
  }, []);

  useEffect(() => {
    if (reviews && reviews.length) {
      let sum = 0;
      let five = 0;
      reviews.forEach((r) => {
        sum += r.rating;
        if (r.rating === 5) five++;
      });
      setAverage((sum / reviews.length).toFixed(1));
      setFiveStarReviews(five);
    }
  }, [reviews]);

  // fucntion to get all reviews:
  const getAllreviews = async () => {
    try {
      const res = await axios.post(
        serverURL + "/api/review/all-review",
        {},
        { withCredentials: true }
      );
          console.log(res.data)
      setReviews(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  // function to send the reply to the comment:
  const sendReply = async (reviewId,courseId) => {
    try {
      const result = await axios.post(
        serverURL + "/api/review/reply-review",
        { reviewId,courseId,reply },
        { withCredentials: true }
      );
      if (result) {
        console.log(result);
        setActiveReply(null);
        setReply("");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // function to delete review:
  const deleteReview = async (reviewId, courseId) => {
    console.log(reviewId, courseId);
    try {
      const result = await axios.post(
        serverURL + "/api/review/delete-review",
        { reviewId, courseId },
        { withCredentials: true }
      );
      if (result) {
        console.log(result.data);
        toast.success("Review deleted.");
        getAllreviews();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div
      className={`h-screen p-6 overflow-auto ${
        mode ? "bg-black text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-2xl font-bold mb-6">Instructor Reviews</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          mode={mode}
          title="Total Reviews"
          value={reviews?.length || 0}
        />
        <StatCard mode={mode} title="Average Rating" value={average || 0} />
        <StatCard mode={mode} title="5★ Reviews" value={fiveStarReviews || 0} />
      </div>

      {/* Reviews */}
      {reviews && reviews.length > 0 ? (
        <div
          className={`rounded-xl shadow-lg overflow-hidden ${
            mode ? "bg-[#1A1B20]" : "bg-white"
          }`}
        >
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead className={`${mode ? "bg-[#22232A]" : "bg-gray-200"}`}>
                <tr>
                  <th className="p-4 text-left">Course</th>
                  <th className="p-4 text-left">Student</th>
                  <th className="p-4 text-left">Rating</th>
                  <th className="p-4 text-left">Review</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews?.map((r, i) => (
                  <React.Fragment key={r.reviewId || i}>
                    <tr
                      className={`border-t ${
                        mode ? "border-gray-700" : "border-gray-200"
                      } hover:bg-opacity-30 ${
                        mode ? "hover:bg-[#2A2B32]" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="p-4 font-medium">{r.courseName}</td>
                      <td className="p-4">{r.reviewerName}</td>
                      <td className="p-4 flex gap-1">
                        {Array.from({ length: r.rating }).map((_, si) => (
                          <FaStar key={si} className="text-yellow-400" />
                        ))}
                      </td>
                      <td className="p-4 text-gray-400 max-w-sm">{r.comment}</td>
                      <td className="p-2 flex items-center gap-3">
                        <button
                          onClick={() => setActiveReply(i)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 transition-colors text-white shadow-sm"
                          title="Reply to this review"
                        >
                          <FaReply className="text-[12px]" /> Reply
                        </button>

                        <button
                          onClick={() => deleteReview(r.reviewId, r.courseId)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md bg-red-600 hover:bg-red-700 transition-colors text-white shadow-sm"
                          title="Delete this review"
                        >
                          <MdDelete className="text-[12px]" /> Delete
                        </button>
                      </td>
                    </tr>

                    {activeReply === i && (
                      <tr>
                        <td colSpan="5" className="p-4 bg-opacity-50">
                          <div
                            className={`rounded-lg p-4 ${
                              mode ? "bg-[#2A2B32]" : "bg-gray-100"
                            }`}
                          >
                            <textarea
                              value={reply}
                              onChange={(e) => setReply(e.target.value)}
                              placeholder="Write your reply here..."
                              className={`w-full p-3 rounded-md text-sm outline-none ${
                                mode
                                  ? "bg-[#1A1B20] text-white"
                                  : "bg-white text-black"
                              }`}
                              rows={3}
                            />
                            <div className="flex justify-end gap-3 mt-3">
                              <button
                                onClick={() => {
                                  setActiveReply(null);
                                  setReply("");
                                }}
                                className="px-4 py-1 text-xs rounded-md border border-gray-400"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => sendReply(r?.reviewId, r?.courseId)}
                                className="px-4 py-1 text-xs rounded-md bg-green-600 hover:bg-green-700 text-white"
                              >
                                Send Reply
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div
          className={`flex flex-col items-center justify-center min-h-[320px] `}
        >
          {/* Icon */}
          <div
            className={`mb-4 flex items-center justify-center w-16 h-16 rounded-full ${
              mode ? "bg-[#2A2B32]" : "bg-white shadow"
            }`}
          >
            <FaStar className="text-yellow-400 text-2xl" />
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold mb-1">No reviews yet</h2>

          {/* Subtitle */}
          <p className="text-sm text-center max-w-md opacity-80">
            Students haven’t reviewed your courses yet. Once reviews are
            submitted, you’ll be able to view, reply, and manage them from here.
          </p>
        </div>
      )}
    </div>
  );
};

export default InstructorReviews;

/* -------- Reusable Stat Card -------- */

const StatCard = ({ title, value, mode }) => (
  <div
    className={`p-5 rounded-xl shadow-md ${mode ? "bg-[#1A1B20]" : "bg-white"}`}
  >
    <p className="text-sm text-gray-400">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
);
