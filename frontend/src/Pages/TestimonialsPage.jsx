import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Testimonials() {
   const mode = useSelector((state)=>state.app.mode)

  const testimonials = [
    {
      name: "Riya Sharma",
      role: "Student",
      feedback:
        "This LMS platform made learning super easy and fun. The courses are well structured and interactive!",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
    },
    {
      name: "Aman Verma",
      role: "Web Developer",
      feedback:
        "Amazing platform! I was able to upgrade my skills and land my dream job. Highly recommend it.",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4,
    },
    {
      name: "Priya Singh",
      role: "Designer",
      feedback:
        "The UI and the learning experience are top-notch. Loved how engaging the lessons were!",
      img: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 5,
    },
  ];

  return (
    <section className={`py-20 ${mode?"bg-black":"bg-[#F6F5F8]"}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl font-extrabold font-Nunito ${mode?"text-white":"text-gray-900"} mb-3`}>
            What Our Learners Say
          </h2>
          <p className={`${mode?"text-gray-300":"text-gray-600"}  text-lg`}>
            Real experiences from our students across the globe ✨
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-10">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className={`relative backdrop-blur-xl ${mode?"bg-[#1F2024] ":"bg-white/70 border border-gray-200"} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}
            >
              {/* Quote Icon */}
              <FaQuoteLeft className={`${mode?"text-white":"text-blue-200"} text-4xl absolute top-6 left-6 opacity-40`} />

              {/* User Image */}
              <div className="flex justify-center -mt-16 mb-6">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-24 h-24 rounded-full ring-4 ring-[#2A27F3]/30 shadow-lg object-cover"
                />
              </div>

              {/* Feedback */}
              <p className={`${mode?"text-gray-300":"text-gray-700"}  text-base italic text-center mb-6 leading-relaxed`}>
                "{t.feedback}"
              </p>

              {/* Rating */}
              <div className="flex justify-center mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <FaStar
                    key={i}
                    className="text-yellow-400 text-lg drop-shadow-sm"
                  />
                ))}
              </div>

              {/* User Info */}
              <div className="text-center">
                <h4 className={`text-lg font-bold ${mode?"text-white":"text-gray-900"} `}>{t.name}</h4>
                <span className={`text-sm ${mode?"text-gray-300":"text-gray-500"} `}>{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
