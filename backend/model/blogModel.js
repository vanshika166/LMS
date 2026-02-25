import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      public_id: String,
      url: String,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
