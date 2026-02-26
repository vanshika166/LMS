import React, { useContext, useEffect, useState } from "react";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { getUserBlogs } from "../redux/actions/blogAction.js";
import { useNavigate } from "react-router-dom";
import { appDataContext } from "../Context/AppContext.jsx";

const BlogPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.app.mode);
  const userblogs = useSelector((state) => state.userBlogs.userBlogData);
  const {serverURL} = useContext(appDataContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [isEdit, setIsEdit] = useState(false);
  const [editBlogId, setEditBlogId] = useState(null);

  useEffect(() => {
    dispatch(getUserBlogs());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [isEdit === true]);

  // fucntion to create a blog:
  const createBlog = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category",category);
    formData.append("excerpt",excerpt)
    formData.append("image", image);
    try {
      const result = await axios.post(
        serverURL + "/api/blog/create",
        formData,
        { withCredentials: true }
      );
      console.log(result);
      if (result) {
        toast.success(result.data.message);
        setContent("");
        setTitle("");
        setImage("");
        setExcerpt("")
        setCategory("")
        dispatch(getUserBlogs())
      }
    } catch (error) {
      console.log("create Blog error:", error);
    }
  };

  // function to delete a blog:
  const deleteBlog = async (id) => {
    try {
      const result = await axios.post(
        serverURL + "/api/blog/delete",
        { id },
        { withCredentials: true }
      );
      console.log(result);
      if (result) {
        toast.success("Blog deleted successfully.");
        dispatch(getUserBlogs());
      }
    } catch (error) {
      console.log("delete blog error:", error);
      toast.error(error.response);
    }
  };

  // isEdit function:
  const handleEdit = (id) => {
    setIsEdit(true);
    let editBlog = userblogs.find((blog) => blog._id === id);
    console.log(editBlog);
    setTitle(editBlog.title);
    setContent(editBlog.content);
    setExcerpt(editBlog.excerpt)
    setCategory(editBlog.category)
    setEditBlogId(editBlog._id);
  };

  // update blog:
  const updateBlog = async (id) => {
    try {
      const result = await axios.post(
        serverURL + "/api/blog/update",
        { id, title, content,excerpt,category },
        { withCredentials: true }
      );
      console.log(result.data);
      if (result) {
        toast.success("Blog updated successully.");
        setTitle("");
        setContent("");
        setEditBlogId(null);
        setExcerpt("")
        setCategory("")
        setIsEdit(false);
        dispatch(getUserBlogs());
      }
    } catch (error) {
      console.log("update blog error:", error);
      toast.error(error.response.data);
    }
  };

  
  return (
    <div className="h-screen overflow-auto  p-6">
      {/* Header */}
      <h1
        className={`text-2xl font-semibold ${
          mode ? "text-white" : "text-gray-800"
        } mb-6`}
      >
        Write your blog here-
      </h1>

      {/* Blog Form */}
      <div
        className={`${
          mode ? "bg-[#1F2024] text-white" : "bg-white text-black"
        } shadow-md rounded-xl p-6 mb-8`}
      >
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
          <FiPlus /> {isEdit ? "Update the blog" : "Write a New Blog"}
        </h2>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-4"
        >
          {/* Title */}
          <input
            type="text"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Category */}
          <select
  onChange={(e) => setCategory(e.target.value)}
  className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200
    ${
      mode
        ? "bg-[#1F2024] text-white border-gray-200 placeholder-gray-400" // 🌙 Dark mode
        : "bg-white text-black border-gray-300 placeholder-gray-600"     // ☀️ Light mode
    }`}
  defaultValue=""
>
  <option value="" disabled>
    Select Category
  </option>

  {/* Learning & Education */}
  <option value="Study Tips">Study Tips</option>
  <option value="Online Learning">Online Learning</option>
  <option value="Course Creation">Course Creation</option>
  <option value="Self-Improvement">Self-Improvement</option>
  <option value="E-Learning Trends">E-Learning Trends</option>
  <option value="Teaching & Mentorship">Teaching & Mentorship</option>

  {/* Technology & Development */}
  <option value="Programming">Programming</option>
  <option value="Web Development">Web Development</option>
  <option value="App Development">App Development</option>
  <option value="AI & Machine Learning">AI & Machine Learning</option>
  <option value="Data Science">Data Science</option>
  <option value="Cybersecurity">Cybersecurity</option>
  <option value="DevOps">DevOps</option>
  <option value="Cloud Computing">Cloud Computing</option>
  <option value="Open Source">Open Source</option>
  <option value="Software Tools">Software Tools</option>

  {/* Design & Creativity */}
  <option value="UI/UX Design">UI/UX Design</option>
  <option value="Graphic Design">Graphic Design</option>
  <option value="Visual Storytelling">Visual Storytelling</option>
  <option value="Branding">Branding</option>
  <option value="Content Creation">Content Creation</option>
  <option value="Animation & Motion Graphics">
    Animation & Motion Graphics
  </option>

  {/* Career & Productivity */}
  <option value="Career Growth">Career Growth</option>
  <option value="Job Hunting">Job Hunting</option>
  <option value="Freelancing">Freelancing</option>
  <option value="Productivity Hacks">Productivity Hacks</option>
  <option value="Work-Life Balance">Work-Life Balance</option>
  <option value="Remote Work">Remote Work</option>
  <option value="Resume & Interview Tips">Resume & Interview Tips</option>

  {/* Community & Insights */}
  <option value="LMS Updates">LMS Updates</option>
  <option value="Industry News">Industry News</option>
  <option value="Success Stories">Success Stories</option>
  <option value="Motivation">Motivation</option>
  <option value="Thought Leadership">Thought Leadership</option>
  <option value="Student Experiences">Student Experiences</option>

  {/* Business & Marketing */}
  <option value="Entrepreneurship">Entrepreneurship</option>
  <option value="Personal Branding">Personal Branding</option>
  <option value="Digital Marketing">Digital Marketing</option>
  <option value="SEO & Content Strategy">SEO & Content Strategy</option>
  <option value="Business Growth">Business Growth</option>
  <option value="Social Media">Social Media</option>
</select>


          {/* Excerpt */}
          <textarea
          onChange={(e)=>setExcerpt(e.target.value)}
          value={excerpt}
            placeholder="Write a short excerpt (1-2 lines summary)"
            rows="2"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>

          {/* Content */}
          <textarea
            placeholder="Write your blog content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="5"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>

          {/* Image URL */}
          <input
            type="file"
            accept="image/*"
            hidden
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <label
            htmlFor="image"
            className={`border ${
              isEdit ? "hidden" : "block"
            } h-[3rem] flex items-center border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {image ? (
              image.name
            ) : (
              <h1 className={`${mode ? "text-gray-300" : "text-gray-700"}`}>
                Upload image URL (optional)
              </h1>
            )}
          </label>

          {/* Submit */}
          {isEdit ? (
            <button
              onClick={() => updateBlog(editBlogId)}
              className="bg-[#2A27F3] w-fit font-semibold text-white hover:bg-[#0c09b5] transition-all duration-300 p-2 rounded-md px-5 font-Nunito"
            >
              Update Blog
            </button>
          ) : (
            <button
              onClick={() => createBlog()}
              className="bg-[#2A27F3] w-fit font-semibold text-white hover:bg-[#0c09b5] transition-all duration-300 p-2 rounded-md px-5 font-Nunito"
            >
              Publish Blog
            </button>
          )}
        </form>
      </div>

      {/* Blog List */}

      {/* label */}
      <h1
        className={`text-2xl font-semibold ${
          mode ? "text-white" : "text-gray-800"
        } mb-6`}
      >
       My blogs
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {userblogs && userblogs.length > 0
          ? userblogs &&
            userblogs.length > 0 &&
            userblogs.map((blog) => (
              <div
                key={blog._id}
                className={`${
                  mode ? "bg-[#1F2024] text-white" : "bg-white text-black"
                } rounded-xl shadow-md overflow-hidden p-2 hover:shadow-lg cursor-default transition-all duration-300`}
              >
                <img
                  src={blog.image.url}
                  alt={blog.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2
                    onClick={() => navigate(`/blogread/${blog._id}`)}
                    className={`text-lg font-semibold hover:text-blue-400 hover:cursor-pointer ${
                      mode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {blog.title}
                  </h2>
                  <p
                    className={`${
                      mode ? "text-gray-300" : "text-gray-600"
                    } text-sm mt-2 line-clamp-3`}
                  >
                    {blog.excerpt}
                  </p>

                  <div className="flex justify-end gap-3 mt-4 text-gray-500">
                    <button
                      onClick={() => handleEdit(blog._id)}
                      className="hover:text-blue-500"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => deleteBlog(blog._id)}
                      className="hover:text-red-600"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default BlogPage;
