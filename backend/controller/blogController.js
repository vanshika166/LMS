import { destroyFromCloudinary, uploadOnCloudinary } from "../config/cloudinary.js";
import Blog from "../model/blogModel.js";
import User from "../model/userModel.js";

// Function for creating a blog:
export const createBlog = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    const { title, content, excerpt, category } = req.body;
    if (!title || !content) {
      return res.status(400).json("Please fill the required fields.");
    }

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const blog = await Blog.create({
      title,
      content,
      image: {
        public_id: image.public_id,
        url: image.secure_url,
      },
      creator: userId,
      excerpt,
      category,
    });

    // push blog id to user's blogs
    await User.findByIdAndUpdate(
      userId,
      { $push: { blogs: blog._id } },
      { new: true },
    );

    // populate creator fields you want to expose
    const populated = await Blog.findById(blog._id).populate(
      "creator",
      "username photoURL description ",
    );

    return res
      .status(201)
      .json({ message: "blog created successfully", data: populated });
  } catch (error) {
    console.log("create blog error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// function to update the blog:
export const updateblog = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId);
    const { id, title, content, excerpt, category } = req.body;

    if (!id) {
      return res.status(400).json("blog Id is required.");
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(400).json("No such blogfound.");
    }
    if (String(blog.creator) !== String(userId)) {
      return res.status(400).json("User not Authorized to update the blog.");
    }

    if (typeof title === "string" && title.trim() !== "") blog.title = title;
    if (typeof content === "string" && content.trim() !== "")
      blog.content = content;
    if (typeof excerpt === "string" && excerpt.trim() !== "")
      blog.excerpt = excerpt;
    if (typeof category === "string" && category.trim() !== "")
      blog.category = category;

    await blog.save();
    const populate = await Blog.findById(blog._id).populate(
      "creator",
      "username photoURL description",
    );
    return res
      .status(200)
      .json({ message: "blog updated successully", data: populate });
  } catch (error) {
    console.log("update blog error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// function to delete the blog
export const deleteBlog = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.body;

    if(!userId){
        return res.status(400).json("user not authenticated.")
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(400).json("Blog not found.");
    }

    if(blog?.image?.public_id){
        await destroyFromCloudinary(blog.image.public_id,"image")
    }

    await Blog.deleteOne({_id:id})

    return res.status(200).json("blog deleted Successfully.");
  } catch (error) {
    console.log("delete blog error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// function for getting user's blog:
export const userBlog = async (req, res) => {
  try {
    const userId = req.userId;
    const userBlogs = await User.findById(userId).populate("blogs");

    if (!userBlogs) {
      return res.status(400).json("User not found");
    }

    return res.status(200).json(userBlogs);
  } catch (error) {
    console.log("userblog error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// function to get all the blogs:
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate(
      "creator",
      "username email photoURL",
    );
    if (!blogs || blogs.length === 0) {
      return res.status(400).json("No blog found.");
    }
    return res.status(200).json(blogs);
  } catch (error) {
    console.log("getBlogs error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// function for getting currentBlog:
export const currentBlog = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.body;
    if (!userId) {
      return res.status(400).json("user does not have a ID.");
    }
    if (!id) {
      return res.status(400).json("blog's Id is required.");
    }
    const blog = await Blog.findById(id).populate(
      "creator",
      "username email photoURL headline",
    );
    if (!blog) {
      return res.status(400).json("No such blog found.");
    }
    return res.status(200).json(blog);
  } catch (error) {
    console.log("currentBlog error:", error);
    return res.status(500).json({ error: error.message });
  }
};
