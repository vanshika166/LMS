import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CoursesSection = () => {
  const mode = useSelector((state) => state.app.mode);
  const navigate = useNavigate();

  const categories = [
    {
      category: "Web development",
      desc: "Build modern websites and web apps.",
      courses: ["HTML & CSS", "JavaScript", "React.js", "Node.js"],
      icon: "fas fa-code",
    },
    {
      category: "Machine Learning",
      desc: "Analyze data and build AI solutions.",
      courses: ["Python", "Machine Learning", "Data Visualization", "AI Tools"],
      icon: "fas fa-database",
    },
    {
      category: "UI/UX Design",
      desc: "Design stunning visuals and user interfaces.",
      courses: ["Photoshop", "Illustrator", "Figma", "UI/UX Principles"],
      icon: "fas fa-paint-brush",
    },
    {
      category: "Digital Marketing",
      desc: "Promote brands and grow online presence.",
      courses: [
        "SEO",
        "Social Media Marketing",
        "Google Ads",
        "Email Marketing",
      ],
      icon: "fas fa-bullhorn",
    },
  ];

  const makeSlug = (text) => {
    return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
  };
  return (
    <section className={`py-20 ${mode ? "bg-black" : "bg-[#F6F5F8]"}`}>
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2
          className={`text-4xl font-extrabold font-Nunito ${mode ? "text-white" : "text-gray-900"} mb-4`}
        >
          Explore Our Programs
        </h2>
        <p
          className={` mb-14 ${mode ? "text-gray-300" : "text-gray-600"} max-w-2xl mx-auto`}
        >
          Choose your field of interest and explore courses designed to build
          your career with hands-on learning and expert guidance.
        </p>

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 text-left">
          {categories.map((cat, index) => (
            <div key={index} className="group flex flex-col">
              {/* Icon + Title */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#2A27F3]/10 text-[#2A27F3] text-xl">
                  <i className={cat.icon}></i>
                </div>
                <h3
                  className={`text-xl font-bold ${mode ? "text-gray-300" : "text-gray-800"} group-hover:text-[#2A27F3] transition`}
                >
                  {cat.category}
                </h3>
              </div>

              {/* Description */}
              <p
                className={` ${mode ? "text-gray-300" : "text-gray-600"} text-sm mb-4`}
              >
                {cat.desc}
              </p>

              {/* Courses as badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {cat.courses.map((course, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm rounded-full bg-[#A4FE6A] text-gray-800 font-medium"
                  >
                    {course}
                  </span>
                ))}
              </div>

              {/* Explore button (link style) */}
              <button
                onClick={() => navigate(`/courses/${makeSlug(cat.category)}`)}
                className="text-[#2A27F3] font-semibold hover:underline self-start"
              >
                Explore →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
