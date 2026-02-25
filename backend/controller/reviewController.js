import Course from "../model/courseModel.js";
import Notification from "../model/notificationsModel.js";
import User from "../model/userModel.js";

// function to add a review:
export const addReview = async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json("user not authenticated!");
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json("Course not found.");
    }

    const alreadyReviewed = course.reviews.find(
      (r) => r.userId.toString() === user._id.toString(),
    );
    if (alreadyReviewed) {
      return res.status(400).json("You have already reviewed the course.");
    }

    // update the course's review:

    course.reviews.push({
      courseId,
      userId: user._id,
      rating,
      comment,
    });
    await course.save();

    // send notification to the educator of the course:
    const educator = await User.findById(course.educator._id);
    if (!educator) {
      return res.status(400).json("User not found.");
    }

    const notification = await Notification.create({
      user: user._id,
      message:
        rating > 0
          ? `${user.username} rated your ${course.title} course ${rating} stars and left a review.`
          : `You received a new review from ${user.username} on your ${course.title} course.`,
      type: rating > 0 ? "review" : "comment",
      isRead: false,
    });

    educator.notifications.push(notification);
    await educator.save();

    return res.status(200).json({ message: "review successfully added." });
  } catch (error) {
    console.log("add review error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// function to get all reviews:
export const getAllReviews = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json("user not autheticated.");
    }

    const user = await User.findById(userId)
      .select("courseCreated")
      .populate({
        path: "courseCreated",
        select: "title reviews",
        populate: { path: "reviews.userId", select: "username" },
      });

    let allReview = [];

    user.courseCreated.forEach((c) => {
      c.reviews.forEach((r) => {
        allReview.push({
          reviewId: r._id,
          rating: r.rating,
          comment: r.comment,
          reviewerName: r.userId.username,
          courseId: c._id,
          courseName: c.title,
        });
      });
    });

    if (!user) {
      return res.status(400).json("user not found.");
    }

    return res.status(200).json(allReview);
  } catch (error) {
    console.log("get all reviews error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// function to reply the review from instructor:
export const adminReply = async (req, res) => {
  try {
    const { reviewId, courseId, reply } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json("user does not exist.");
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(200).json("course not found.");
    }

    let review = course.reviews.find(
      (r) => r._id.toString() === reviewId.toString(),
    );
    if (!review) {
      return res.status(400).json("no such review found.");
    }

    review.reply = {
      reply,
      adminName: user._id,
    };

    await course.save();


    return res.status(201).json({ message: "reply sent.", data: course });
  } catch (error) {
    console.log("admin reply error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// function to delete review:
export const deleteReview = async (req, res) => {
  try {
    const { reviewId, courseId } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json("user not Authenticated.");
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json("course not found.");
    }

    let review = course.reviews.find(
      (r) => r._id.toString() === reviewId.toString(),
    );
    if (!review) {
      return res.status(400).json("no review found");
    }

    course.reviews.pull({ _id: reviewId });
    await course.save();

    return res.status(200).json("Review deleted successfully.");
  } catch (error) {
    console.log("delete reply error:", error);
    return res.status(500).json({ error: error.message });
  }
};
