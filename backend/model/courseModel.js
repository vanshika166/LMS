import mongoose from "mongoose";

// lesson schema:
const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  type: {
    type: String,
    enum: ["video", "text", "image"],
    default: "video",
  },
  duration: Number,
  fileURL: {
    public_id: String,
    url: String,
  },
  learningObjective: {
    type: String,
    default: "",
  },
  textContent: {
    type: String,
    default: "",
  },
});

// section schema:
const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  objective: {
    type: String,
    // required:true
  },
  lessons: [lessonSchema],
  totalDuration: Number,
});

// reply schema:

const replySchema = new mongoose.Schema(
  {
    reply: {
      type: String,
    },
    adminName: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

// review schema:
const reviewSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
    },
    reply: replySchema,
  },
  { timestamps: true },
);

// course schema:
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug:String,
    educator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: String,
      required: true,
    },
    categorySlug:String,
    level: {
      type: String,
      enum: ["Begginer", "Intermediate", "Advance"],
      default: "Beginner",
    },
    description: {
      type: String,
      required: true,
    },
    detailedDescription: {
      type: String,
      required: true,
    },
    learnings: [
      {
        type: String,
        trim: true,
      },
    ],
    highlights: [
      {
        type: String,
        trim: true,
      },
    ],
    outcomes: [
      {
        type: String,
        trim: true,
      },
    ],
    projects: [
      {
        type: String,
        trim: true,
      },
    ],
    isFree: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    coverImage: {
      public_id: String,
      url: String,
    },
    coverVideo: {
      public_id: String,
      url: String,
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    sections: [sectionSchema],
    isPublished: {
      type: Boolean,
      default: false,
    },
    reviews: [reviewSchema],
  },
  { timestamps: true },
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
