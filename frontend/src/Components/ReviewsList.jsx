import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const ReviewItem = ({ review, mode }) => {
  const [expanded, setExpanded] = useState(false);

  const username =
    typeof review?.userId === "object"
      ? review.userId?.username || "Anonymous"
      : review?.userId || "Anonymous";

  const photo =
    typeof review?.userId === "object"
      ? review.userId?.photoURL?.url || "/profile.jpg"
      : "/profile.jpg";

  const created = review?.createdAt
    ? new Date(review.createdAt).toLocaleDateString()
    : "";

  const comment = review?.comment || "";

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        mode ? "bg-[#2A2A2E] border-[#3A3A3C]" : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={photo}
            alt={username}
            className="h-12 w-12 rounded-full object-cover flex-shrink-0"
          />

          <div>
            <p className="font-semibold capitalize">{username}</p>
            <p className="text-xs text-gray-400">{created}</p>
          </div>
        </div>

        <div className="flex gap-1 items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`text-sm ${
                star <= (review?.rating || 0)
                  ? "text-yellow-400"
                  : "text-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      <p
        className={`text-sm leading-relaxed ${
          mode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {expanded
          ? comment
          : comment.length > 220
          ? `${comment.slice(0, 220)}...`
          : comment}
      </p>

      {comment.length > 220 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm text-[#2A27F3] font-semibold"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {/* 🎓 Instructor Reply (only if exists) */}
      {review?.reply?.reply && (
        <div
          className={`mt-4 ml-6 p-4 rounded-lg border-l-4 ${
            mode
              ? "bg-[#1C1C1E] border-[#2A27F3] text-gray-300"
              : "bg-white border-[#2A27F3] text-gray-700"
          }`}
        >
          <p className={`text-xs font-semibold ${mode?"text-white": "text-[#2A27F3]"} mb-1`}>
            Educator Reply
          </p>

          <p className="text-sm leading-relaxed">{review.reply.reply}</p>

          {/* 📅 Reply Date */}
          {review?.reply?.createdAt && (
            <p className="text-[11px] text-gray-400 mt-2">
              Replied on{" "}
              {new Date(review.reply.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const ReviewsList = ({ reviews = [], mode = false }) => {
  return (
    <div className="space-y-5">
      {reviews.map((review, idx) => (
        <ReviewItem key={idx} review={review} mode={mode} />
      ))}
    </div>
  );
};

export default ReviewsList;
