import mongoose from "mongoose";

const reviewschema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    comment: {
      type: String,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true },
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    reviews: [reviewschema],
    courseProgress: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        sections: [
          {
            sectionId: { type: mongoose.Schema.Types.ObjectId },
            completedLessons: [
              {
                lessonId: { type: mongoose.Schema.Types.ObjectId },
                completed: { type: Boolean, default: false },
                createdAt: { type: Date, default: Date.now },
              },
            ],
            isCompleted: { type: Boolean, default: false },
          },
        ],
        overAllProgress: { type: Number, default: 0 },
        lastAccessed: { type: Date, default: Date.now },
        CourseCompleted: { type: Boolean, default: false },
      },
    ],

    wishlist: [{ type: mongoose.Types.ObjectId, ref: "Course" }],
    role: {
      type: String,
      enum: ["student", "educator"],
      required: true,
    },
    photoURL: {
      public_id: String,
      url: String,
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    courseCreated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    resetOtp: {
      type: String,
    },
    isOtpVerify: {
      type: Boolean,
      default: false,
    },
    OtpExpire: {
      type: Date,
    },
    location: {
      type: String,
    },
    headline: {
      type: String,
    },
    teachingPhilosophy: {
      type: String,
    },
    languages: {
      type: [String],
    },
    phone: {
      type: String,
    },
    certifications: {
      type: String,
    },
    skills: {
      type: Array,
    },
    experience: {
      type: Number,
    },
    teachingExperience: {
      type: Number,
    },
    specializations: {
      type: Array,
    },
    linkedIn: {
      type: String,
      default: "",
    },
    youtube: {
      type: String,
      default: "",
    },
    twitter: {
      type: String,
      default: "",
    },
    personal: {
      type: String,
      default: "",
    },
    notifications:[
      {
        type:mongoose.Schema.ObjectId,
        ref:"Notification"
      }
    ]
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
