import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "../redux/actions/blogAction.js";

const Blog = () => {
  const allBlogs = useSelector((state) => state.userBlogs?.allBlogs);
  const mode = useSelector((state) => state.app.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);

  return (
    <>
      {/* Hero Section */}
      <section
        className={`transition-colors p-4 py-7 duration-300 ${
          mode ? "bg-black" : "bg-[#F6F5F8]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1
              className={`text-4xl sm:text-5xl font-Nunito font-extrabold tracking-tight ${
                mode ? "text-white" : "text-gray-900"
              }`}
            >
              Our Blog
            </h1>
            <p
              className={`mt-4 leading-relaxed ${
                mode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Insights on learning, productivity, and programming — curated by
              our instructors and community.
            </p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section
        className={`py-10 transition-colors duration-300 ${
          mode ? "bg-black" : "bg-[#F6F5F8]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {allBlogs?.map((post, idx) => (
              <motion.article
                key={post.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: idx * 0.03 }}
                className={`group rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${
                  mode
                    ? "bg-[#2A2B31] border-[#3A3B40]"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="relative">
                  <img
                    src={post.image.url}
                    alt={post.title}
                    className="w-full h-52 object-cover group-hover:opacity-90 transition"
                  />
                  <span className="absolute top-3 left-3 bg-[#2A27F3] text-white text-xs px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>

                <div className="p-6">
                  <h3
                    className={`text-xl font-semibold line-clamp-2 transition-colors ${
                      mode
                        ? "text-gray-100 group-hover:text-[#A4FE6A]"
                        : "text-gray-900 group-hover:text-[#2A27F3]"
                    }`}
                  >
                    {post.title}
                  </h3>

                  <p
                    className={`mt-2 line-clamp-3 ${
                      mode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {post.excerpt}
                  </p>

                  <div
                    className={`mt-5 flex items-center justify-between text-sm ${
                      mode ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    <span>{post.creator.username}</span>
                    <span>
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : ""}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/blogread/${post._id}`)}
                    className={`mt-5 w-full py-2.5 rounded-xl font-medium transition ${
                      mode
                        ? "bg-[#2A27F3] text-white hover:bg-[#1f1bc7]"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                    }`}
                  >
                    Read Article
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Empty State */}
          {allBlogs?.length === 0 && (
            <div className="text-center py-16">
              <h4
                className={`text-lg font-semibold ${
                  mode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                No articles found
              </h4>
              <p className={`${mode ? "text-gray-500" : "text-gray-600"} mt-2`}>
                Try a different keyword or category.
              </p>
            </div>
          )}

          {/* Pagination (Static UI) */}
          <div className="mt-12 flex items-center justify-center gap-2">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`px-4 py-2 rounded-xl border text-sm transition-all ${
                  n === 1
                    ? "bg-[#2A27F3] text-white border-[#2A27F3]"
                    : mode
                    ? "bg-[#2A2B31] text-gray-300 border-[#3A3B40] hover:border-[#2A27F3]"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#2A27F3]"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
