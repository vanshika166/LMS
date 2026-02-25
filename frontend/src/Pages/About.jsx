import { useSelector } from "react-redux";

const About = () => {
  const mode = useSelector((state) => state.app.mode); // true => dark mode

  return (
    <>
      <div
        className={`min-h-screen flex flex-col justify-center px-6 sm:px-12 py-20 transition-all duration-300 ${
          mode ? "bg-black text-gray-200" : "bg-[#F6F5F8] text-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - About Content */}
          <div>
            <h1
              className={`text-4xl sm:text-5xl font-extrabold font-Nunito mb-6 ${
                mode ? "text-white" : "text-gray-900"
              }`}
            >
              About Us
            </h1>

            <p
              className={`mb-6 leading-relaxed ${
                mode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              We believe learning should be simple, accessible, and powerful.
              Our platform is designed to help students grow their skills,
              track progress, and achieve their goals with confidence.
            </p>

            <p
              className={`mb-8 leading-relaxed ${
                mode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Whether you're just starting your journey or advancing your
              expertise, we provide structured courses, expert guidance, and
              an engaging learning experience tailored for modern learners.
            </p>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-6 mt-10">
              <div>
                <h2 className="text-3xl font-bold text-[#2A27F3]">500+</h2>
                <p className={mode ? "text-gray-400" : "text-gray-600"}>
                  Courses
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-[#2A27F3]">10K+</h2>
                <p className={mode ? "text-gray-400" : "text-gray-600"}>
                  Students
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-[#2A27F3]">95%</h2>
                <p className={mode ? "text-gray-400" : "text-gray-600"}>
                  Satisfaction
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Values Card */}
          <div
            className={`rounded-2xl p-10 shadow-lg border transition-all duration-300 ${
              mode
                ? "bg-[#1F2024] border-gray-700"
                : "bg-white border border-gray-100"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-6 ${
                mode ? "text-white" : "text-gray-900"
              }`}
            >
              Our Mission
            </h2>

            <p
              className={`mb-6 leading-relaxed ${
                mode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              To make high-quality education accessible to everyone,
              everywhere. We aim to bridge the gap between knowledge and
              opportunity through technology-driven learning.
            </p>

            <h3
              className={`text-xl font-semibold mb-4 ${
                mode ? "text-white" : "text-gray-900"
              }`}
            >
              What We Focus On
            </h3>

            <ul
              className={`space-y-3 ${
                mode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <li>✔ Structured & Practical Courses</li>
              <li>✔ Progress Tracking & Certifications</li>
              <li>✔ Beginner to Advanced Learning Paths</li>
              <li>✔ Interactive & Modern Experience</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
