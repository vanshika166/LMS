import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import { useSelector } from "react-redux";

const SuccessStories = () => {
   const mode = useSelector((state)=>state.app.mode)

  const stories = [
    {
      name: "Aarav Sharma",
      course: "Full Stack Development",
      story:
        "From beginner to Software Engineer at Infosys. Our LMS helped me gain confidence and land my dream job.",
      company: "Infosys",
    },
    {
      name: "Neha Patel",
      course: "Data Science",
      story:
        "Switched my career to Data Analyst at TCS in 6 months. The projects and guidance made it possible!",
      company: "TCS",
    },
    {
      name: "Rohit Verma",
      course: "UI/UX Design",
      story:
        "Hands-on projects helped me land a role at Zomato as Junior Designer. Truly transformative!",
      company: "Zomato",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Students Trained" },
    { number: "95%", label: "Success Rate" },
    { number: "500+", label: "Career Transitions" },
  ];

  const topCompanies = [
    { name: "Google", logo: "/google.png" },
    { name: "Microsoft", logo: "/microsoft.png" },
    { name: "Amazon", logo: "/amazon.png" },
    { name: "Infosys", logo: "/infosys.png" },
    { name: "TCS", logo: "/TCS.png" },
    { name: "Zomato", logo: "/zomato.png" },
  ];

  return (
    <section className={`${mode?"bg-black text-white":"bg-[#F6F5F8] text-gray-800"}py-16`}>
      {/* Heading */}
      <div className="text-center mb-12 px-6">
        <h2 className={`text-4xl font-bold mb-4 font-Nunito ${mode?"text-white":"text-gray-900"}`}>
          Student <span className="text-[#2A27F3]">Success Stories</span>
        </h2>
        <p className={`text-lg ${mode?"text-gray-300":"text-gray-600"} max-w-2xl mx-auto`}>
          Real journeys of learners achieving their career dreams with our
          platform.
        </p>
      </div>

      {/* Stories Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
        {stories.map((student, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className={`${mode?"bg-[#1F2024]":"bg-white"} rounded-2xl p-8 shadow-lg hover:shadow-2xl relative border border-gray-100`}
          >
            {/* Decorative Quote Icon */}
            <FaQuoteLeft className={`text-3xl ${mode?"text-white":"text-[#2A27F3]"} absolute top-5 left-6 opacity-10`} />

            {/* Abstract Shape Instead of Image */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[#A4FE6A] flex items-center justify-center text-[#2A27F3] font-bold text-xl shadow-md">
              {student.course.split(" ")[0].slice(0, 2).toUpperCase()}
            </div>

            {/* Student Details */}
            <h3 className={`text-lg font-semibold text-center ${mode?"text-white":"text-gray-900"}`}>
              {student.name}
            </h3>
            <p className="text-sm text-[#2A27F3] text-center font-medium">
              {student.course}
            </p>

            <p className={`mt-4 ${mode?"text-gray-300":"text-gray-900"} text-sm text-center leading-relaxed italic`}>
              "{student.story}"
            </p>

            {/* Company Tag */}
            <div className="mt-6 flex justify-center">
              <span className="px-4 py-1 rounded-full text-xs font-semibold bg-[#2A27F3] text-white">
                {student.company}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-16 flex flex-wrap justify-center gap-6 text-center">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className={`${mode?"bg-[#1F2024]":"bg-white"} rounded-3xl p-6 shadow-2xl w-48`}
          >
            <h3 className="text-3xl font-bold text-[#2A27F3]">{stat.number}</h3>
            <p className={`${mode?"text-white":"text-gray-700"} mt-1`}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Top Companies Section */}
      <div className="mt-20 pb-[3rem] text-center px-6">
        <h3 className="text-2xl font-bold mb-8">
          Top Companies Our Students Work With
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {topCompanies.map((company, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              className="bg-white p-4 rounded-2xl shadow-lg flex items-center justify-center w-32 h-20"
            >
              <img
                src={company.logo}
                alt={company.name}
                className="h-full w-full object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
