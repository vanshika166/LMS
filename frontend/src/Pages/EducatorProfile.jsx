import {
  FaYoutube,
  FaTwitter,
  FaLinkedinIn,
  FaStar,
  FaGlobe,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { appDataContext } from "../Context/AppContext.jsx";

const EducatorProfile = () => {

  useEffect(() => {
    window.scrollTo({top:0,behavior:"smooth"})
  }, [])
  



  const navigate = useNavigate();
  const { id } = useParams();

  const [educator, setEducator] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [courses, setCourses] = useState(null);
  const [count, setCount] = useState(0);

  const mode = useSelector((state) => state.app.mode);
  const { serverURL } = useContext(appDataContext);

  useEffect(() => {
    educatorProfile();
    allReviews();
    educatorCourses();
    getStudentCount();
  }, []);

  const educatorProfile = async () => {
    try {
      const res = await axios.get(
        `${serverURL}/api/user/educator/${id}`,
        { withCredentials: true }
      );
      setEducator(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const allReviews = async () => {
    try {
      const res = await axios.post(
        `${serverURL}/api/review/all-review`,
        {},
        { withCredentials: true }
      );
      setReviews(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const educatorCourses = async () => {
    try {
      const res = await axios.post(
        `${serverURL}/api/course/all-courses`,
        {},
        { withCredentials: true }
      );
      setCourses(res.data.courseCreated);
    } catch (err) {
      console.log(err);
    }
  };

  const getStudentCount = async () => {
    try {
      const res = await axios.post(
        `${serverURL}/api/enroll/all-student`,
        {},
        { withCredentials: true }
      );
      setCount(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const socialLinks = [
    { icon: <FaLinkedinIn />, link: educator?.linkedIn },
    { icon: <FaYoutube />, link: educator?.youtube },
    { icon: <FaTwitter />, link: educator?.twitter },
    { icon: <FaGlobe />, link: educator?.personal },
  ];

  return (
    <div
      className={`min-h-screen ${
        mode ? "bg-black text-white" : "bg-[#F6F5F8] text-gray-900"
      }`}
    >

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* ================= LEFT CONTENT ================= */}
          <div className="lg:col-span-2">
            <p className="text-xs tracking-widest uppercase text-[#2A27F3] font-semibold">
              Instructor
            </p>

            <h1 className="text-4xl font-bold mt-2">
              {educator?.username}
            </h1>

            <p className="text-lg opacity-80 mt-1">
              {educator?.headline || educator?.role}
            </p>

            {/* Stats */}
            <div className="flex gap-16 mt-10">
              <div>
                <p className="text-2xl font-bold">{count || 0}</p>
                <p className="text-sm opacity-70">Total learners</p>
              </div>

              <div>
                <p className="text-2xl font-bold">
                  {educator?.experience || 0}+
                </p>
                <p className="text-sm opacity-70">Years experience</p>
              </div>

              {reviews?.length > 0 && (
                <div>
                  <p className="text-2xl font-bold">
                    {reviews.length}
                  </p>
                  <p className="text-sm opacity-70">Reviews</p>
                </div>
              )}
            </div>

            {/* About */}
            <div className="mt-14">
              <h2 className="text-2xl font-semibold mb-4">
                About me
              </h2>
              <p className="text-sm leading-relaxed opacity-80 max-w-3xl">
                {educator?.description}
              </p>
            </div>

            {/* Teaching Philosophy */}
            {educator?.teachingPhilosophy && (
              <div className="mt-14">
                <h2 className="text-2xl font-semibold mb-4">
                  Teaching Philosophy
                </h2>
                <p className="text-sm leading-relaxed opacity-80 max-w-3xl">
                  {educator.teachingPhilosophy}
                </p>
              </div>
            )}

            {/* Skills & Specializations */}
            <div className="mt-14 grid sm:grid-cols-2 gap-10">
              {educator?.skills?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {educator.skills.map((s, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 text-xs rounded-full ${
                          mode
                            ? "bg-white/10"
                            : "bg-[#EEF0FF] text-[#2A27F3]"
                        }`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {educator?.specializations?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Specializations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {educator.specializations.map((sp, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 text-xs rounded-full border ${
                          mode
                            ? "border-white/20"
                            : "border-[#2A27F3]/30 text-[#2A27F3]"
                        }`}
                      >
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ================= COURSES ================= */}
            <div className="mt-16">
              <h2 className="text-2xl font-semibold mb-6">
                Courses by {educator?.username}
              </h2>

              <div className="grid sm:grid-cols-2 gap-6">
                {courses?.map((c, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      navigate(`/course-detail/${c?._id}`)
                    }
                    className={`rounded-xl overflow-hidden border cursor-pointer transition hover:shadow-lg ${
                      mode
                        ? "bg-[#16171C] border-white/10"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <img
                      src={c?.coverImage}
                      alt="course"
                      className="w-full h-40 object-cover"
                    />

                    <div className="p-4 space-y-2">
                      <h3 className="text-sm font-semibold line-clamp-2">
                        {c?.title}
                      </h3>

                      <p className="text-xs opacity-70">
                        {c?.level}
                      </p>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-yellow-400 font-semibold">
                          4.8
                        </span>
                        <div className="flex text-yellow-400">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <FaStar key={i} />
                            ))}
                        </div>
                        <span className="opacity-60">
                          (120k+)
                        </span>
                      </div>

                      <span className="text-xs opacity-60">
                        ⏱ 42 hours
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= RIGHT CARD (UNCHANGED LAYOUT) ================= */}
          <div
            className={`rounded-2xl p-6 shadow-xl h-fit sticky top-24 ${
              mode ? "bg-[#16171C]" : "bg-[#F6F5F8]"
            }`}
          >
            <img
              src={educator?.photoURL || "/profile.jpg"}
              alt="Instructor"
              className="w-32 h-32 rounded-full object-cover mx-auto"
            />

            <div className="mt-4 text-center text-sm opacity-80 space-y-1">
              {educator?.location && <p>📍 {educator.location}</p>}
              {educator?.languages?.length > 0 && (
                <p>
                  🌍 {educator.languages.join(", ")}
                </p>
              )}
            </div>

            <button
            onClick={()=>{window.location.href = `mailto:${educator?.email}`}}
            className="w-full mt-6 bg-[#2A27F3] hover:bg-[#0d09e0] transition text-white py-3 rounded-lg font-medium">
              Send message
            </button>

            <div className="flex justify-center gap-4 mt-6">
              {socialLinks.map(
                (item, i) =>
                  item.link && (
                    <a
                      key={i}
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className={`w-10 h-10 rounded-lg flex items-center justify-center border transition ${
                        mode
                          ? "border-white/20 hover:bg-white/10"
                          : "border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-[#2A27F3]">
                        {item.icon}
                      </span>
                    </a>
                  )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducatorProfile;
