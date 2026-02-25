import axios from "axios";
import { useContext,useState,useEffect } from "react";
import {
  FiLock,
  FiLogOut,
  FiEdit2,
  FiCheck,
  FiBookOpen,
  FiUsers,
  FiStar,
  FiDollarSign,
  FiTrendingUp,
  FiGlobe,
  FiLinkedin,
  FiYoutube,
  FiTwitter,
  FiAward,
  FiFileText,
  FiLink,
  FiPlus,
  FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { appDataContext } from "../Context/AppContext.jsx";
import { getUserCourses } from "../redux/actions/userCoursesAction.js";
import { setUserData } from "../redux/userSlice.js";

const ProfileSettingsPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  // ensure we always get an array (avoid undefined)
  const userCourses = useSelector(
    (state) => state.userCourseData?.userCourseData || []
  );
  const mode = useSelector((state) => state.app.mode);
  const { serverURL } = useContext(appDataContext);

  // Basic Information States:
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");

  // Professional Information States:
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);

  // Social media links Stats:
  const [linkedIn, setLinkedIn] = useState("");
  const [youtube, setYoutube] = useState("");
  const [twitter, settwitter] = useState("");
  const [personal, setPersonal] = useState("");

  // Teaching Information States:
  const [specializations, setSpecializations] = useState([]);
  const [teachingPhilosophy, setTeachingPhilosophy] = useState("");
  const [reviews, setReviews] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");
  const navigate = useNavigate();
  const [students, setStudents] = useState(0)
  const [rating, setRating] = useState(0);

  useEffect(() => {
    getAllreviews();
    allStudents()
    if (reviews) {
      let sum = 0;
      reviews.forEach((r) => {
        sum += r.rating;
      });

      setRating((sum / reviews.length).toFixed(1));
    }
  }, []);

  // fucntion to get all reviews:
  const getAllreviews = async () => {
    try {
      const res = await axios.post(
        serverURL + "/api/review/all-review",
        {},
        { withCredentials: true }
      );
      setReviews(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  // function to get all students:
const allStudents = async()=>{
  try {
    const result = await axios.post(serverURL+'/api/enroll/all-student',{},{withCredentials:true})
    if(result){
      console.log(result.data)
      setStudents(result.data)
    }
  } catch (error) {
    console.log(error)
  }
}

  useEffect(() => {
    // wait for user to be available, then fetch courses for that user
    if (!user) return;
    dispatch(getUserCourses(user._id));
  }, [dispatch, user]);

  useEffect(() => {
    if (!user) return;
    setUsername(user.username || "");
    setDescription(user.description || "");
    setPhotoURL(user.photoURL || "");
    setHeadline(user.headline || "");
    setLocation(user.location || "");
    setPhone(user.phone || "");
    setExperience(user.experience ?? "");
    setSkills(Array.isArray(user.skills) ? user.skills : []);
    setLanguages(Array.isArray(user.languages) ? user.languages : []);
    setLinkedIn(user.linkedIn || "");
    setYoutube(user.youtube || "");
    settwitter(user.twitter || "");
    setPersonal(user.personal || "");
    // setTeachingExperience(user.teachingExperience ?? "");
    setSpecializations(
      Array.isArray(user.specializations) ? user.specializations : []
    );
    setTeachingPhilosophy(user.teachingPhilosophy || "");
  }, [user]);

  // Mock stats (in real app, fetch from API)
  const totalCoursesCount = Array.isArray(userCourses)
    ? userCourses.length
    : user?.courseCreated || 0;

  const stats = {
    totalStudents:students || 0,
    totalCourses: totalCoursesCount,
    averageRating: rating || 0,
    totalRevenue: user?.totalRevenue || 0,
    completionRate: user?.completionRate || 0,
  };

  // Function for update educator profile:
  const updateProfile = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("description", description);
    formData.append("headline", headline);
    formData.append("location", location);
    formData.append("phone", phone);
    // formData.append("education", JSON.stringify(education));
    formData.append("experience", experience);
    formData.append("skills", JSON.stringify(skills));
    // formData.append("certifications", JSON.stringify(certifications));
    formData.append("languages", JSON.stringify(languages));
    // formData.append("teachingExperience", teachingExperience);
    formData.append("specializations", JSON.stringify(specializations));
    formData.append("teachingPhilosophy", teachingPhilosophy);
    formData.append("photoURL", photoURL);
    formData.append("linkedIn", linkedIn);
    formData.append("youtube", youtube);
    formData.append("twitter", twitter);
    formData.append("personal", personal);

    try {
      const result = await axios.post(
        serverURL + "/api/user/profile",
        formData,
        { withCredentials: true }
      );
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      console.log(result.data);
    } catch (error) {
      toast.error("Failed to update profile");
      console.log("update profile error:", error);
    }
  };

  // Function for logot
  const handleLogout = async () => {
    try {
      const result = await axios.get(serverURL + "/api/auth/logout", {
        withCredentials: true,
      });
      console.log(result.data);
      navigate("/");
      dispatch(setUserData(null))
      toast.success(result.data.message);
    } catch (error) {
      console.log("logout error:", error);
    }
  };

  // Helper functions for dynamic arrays
  const addArrayItem = (setter, newItem) => {
    setter((prev) => [...prev, newItem]);
  };

  const removeArrayItem = (setter, index) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const updateArrayItem = (setter, index, newItem) => {
    setter((prev) => prev.map((item, i) => (i === index ? newItem : item)));
  };

  const addSkill = () => {
    const skill = prompt("Enter new skill:");
    if (skill) addArrayItem(setSkills, skill.trim());
  };

  const addSpecialization = () => {
    const spec = prompt("Enter specialization:");
    if (spec) addArrayItem(setSpecializations, spec.trim());
  };

  const addLanguage = () => {
    const lang = prompt("Enter language:");
    if (lang) addArrayItem(setLanguages, lang.trim());
  };

  const sections = [
    { id: "basic", title: "Basic Info", icon: FiEdit2 },
    { id: "professional", title: "Professional", icon: FiFileText },
    { id: "social", title: "Social Links", icon: FiLink },
  ];

  return (
    <div className="h-screen overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Stats */}
        <div
          className={`${
            mode ? "bg-[#1F2024]" : "bg-white"
          } rounded-xl shadow-lg p-6 mb-6`}
        >
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
            <input
              type="file"
              id="photoURL"
              accept="image/*"
              hidden
              onChange={(e) => setPhotoURL(e.target.files[0])}
            />
            <label htmlFor="photoURL" className="cursor-pointer relative">
              <img
                src={
                  photoURL instanceof File
                    ? URL.createObjectURL(photoURL)
                    : user?.photoURL?.url ||
                      "https://www.w3schools.com/howto/img_avatar.png"
                }
                alt="profile"
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-blue-200 hover:border-blue-400 transition-colors object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <FiEdit2 className="text-white text-xl" />
              </div>
            </label>
            <div className="flex-1">
              <h1
                className={`text-3xl font-bold ${
                  mode ? "text-white" : "text-gray-800"
                } mb-2`}
              >
                {username || user?.username}
              </h1>
              <p className={`${mode ? "text-gray-300" : "text-gray-600"} mb-2`}>
                {headline || "Professional Educator"}
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                  {user?.role}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-600 text-sm rounded-full">
                  {user?.experience || 0} Years Teaching
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div
              className={`${
                mode ? "bg-gray-800" : "bg-gray-50"
              } rounded-lg p-4 text-center`}
            >
              <FiUsers
                className={`${
                  mode ? "text-blue-400" : "text-blue-600"
                } text-2xl mx-auto mb-2`}
              />
              <div
                className={`text-2xl font-bold ${
                  mode ? "text-white" : "text-gray-800"
                }`}
              >
                {stats.totalStudents.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Students</div>
            </div>
            <div
              className={`${
                mode ? "bg-gray-800" : "bg-gray-50"
              } rounded-lg p-4 text-center`}
            >
              <FiBookOpen
                className={`${
                  mode ? "text-green-400" : "text-green-600"
                } text-2xl mx-auto mb-2`}
              />
              <div
                className={`text-2xl font-bold ${
                  mode ? "text-white" : "text-gray-800"
                }`}
              >
                {stats.totalCourses}
              </div>
              <div className="text-sm text-gray-500">Courses</div>
            </div>
            <div
              className={`${
                mode ? "bg-gray-800" : "bg-gray-50"
              } rounded-lg p-4 text-center`}
            >
              <FiStar
                className={`${
                  mode ? "text-yellow-400" : "text-yellow-600"
                } text-2xl mx-auto mb-2`}
              />
              <div
                className={`text-2xl font-bold ${
                  mode ? "text-white" : "text-gray-800"
                }`}
              >
                {rating}
              </div>
              <div className="text-sm text-gray-500">Rating</div>
            </div>
            <div
              className={`${
                mode ? "bg-gray-800" : "bg-gray-50"
              } rounded-lg p-4 text-center`}
            >
              <FiDollarSign
                className={`${
                  mode ? "text-purple-400" : "text-purple-600"
                } text-2xl mx-auto mb-2`}
              />
              <div
                className={`text-2xl font-bold ${
                  mode ? "text-white" : "text-gray-800"
                }`}
              >
                ${stats.totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Revenue</div>
            </div>
            <div
              className={`${
                mode ? "bg-gray-800" : "bg-gray-50"
              } rounded-lg p-4 text-center`}
            >
              <FiTrendingUp
                className={`${
                  mode ? "text-red-400" : "text-red-600"
                } text-2xl mx-auto mb-2`}
              />
              <div
                className={`text-2xl font-bold ${
                  mode ? "text-white" : "text-gray-800"
                }`}
              >
                {stats.completionRate}%
              </div>
              <div className="text-sm text-gray-500">Completion</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          className={`${
            mode ? "bg-[#1F2024]" : "bg-white"
          } rounded-xl shadow-lg mb-6`}
        >
          <div className="flex overflow-x-auto px-2 sm:px-0">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-6 py-4 min-w-max border-b-2 transition-colors ${
                    activeSection === section.id
                      ? "border-blue-500 text-blue-600"
                      : `border-transparent ${
                          mode
                            ? "text-gray-300 hover:text-blue-400"
                            : "text-gray-600 hover:text-blue-600"
                        }`
                  }`}
                >
                  <Icon className="text-lg" />
                  {section.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Sections */}
        <div
          className={`${
            mode ? "bg-[#1F2024]" : "bg-white"
          } rounded-xl shadow-lg p-4 md:p-6`}
        >
          {/* Basic Info Section */}
          {activeSection === "basic" && (
            <div className="space-y-6">
              <h2
                className={`text-2xl font-bold ${
                  mode ? "text-white" : "text-gray-800"
                } mb-6`}
              >
                Basic Information
              </h2>

              {/* username */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                      mode
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-50 text-gray-700"
                    } ${isEditing ? "focus:ring-2 focus:ring-blue-500" : ""}`}
                  />
                </div>

                {/* email */}

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                      mode
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-50 text-gray-700"
                    } opacity-60`}
                  />
                </div>

                {/* headline */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Senior React Developer & Educator"
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                      mode
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-50 text-gray-700"
                    } ${isEditing ? "focus:ring-2 focus:ring-blue-500" : ""}`}
                  />
                </div>

                {/* location */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                      mode
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-50 text-gray-700"
                    } ${isEditing ? "focus:ring-2 focus:ring-blue-500" : ""}`}
                  />
                </div>

                {/* phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                      mode
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-50 text-gray-700"
                    } ${isEditing ? "focus:ring-2 focus:ring-blue-500" : ""}`}
                  />
                </div>

                {/* teaching experince */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Teaching Experience (Years)
                  </label>
                  <input
                    type="number"
                    disabled={!isEditing}
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                      mode
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-50 text-gray-700"
                    } ${isEditing ? "focus:ring-2 focus:ring-blue-500" : ""}`}
                  />
                </div>
              </div>
              {/* description */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Bio / About Me
                </label>
                <textarea
                  rows="4"
                  disabled={!isEditing}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell students about your background, experience, and teaching approach..."
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                    mode
                      ? "bg-gray-800 text-gray-300"
                      : "bg-gray-50 text-gray-700"
                  } ${isEditing ? "focus:ring-2 focus:ring-blue-500" : ""}`}
                />
              </div>

              {/* teachingPhilosophy */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Teaching Philosophy
                </label>
                <textarea
                  rows="3"
                  disabled={!isEditing}
                  value={teachingPhilosophy}
                  onChange={(e) => setTeachingPhilosophy(e.target.value)}
                  placeholder="What's your approach to teaching and learning?"
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                    mode
                      ? "bg-gray-800 text-gray-300"
                      : "bg-gray-50 text-gray-700"
                  } ${isEditing ? "focus:ring-2 focus:ring-blue-500" : ""}`}
                />
              </div>

              {/* Languages */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-500">
                    Languages
                  </label>
                  {isEditing && (
                    <button
                      onClick={addLanguage}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <FiPlus className="text-sm" /> Add Language
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 px-3 py-1 ${
                        mode ? "bg-gray-700" : "bg-gray-100"
                      } rounded-full`}
                    >
                      <span
                        className={`text-sm ${
                          mode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {lang}
                      </span>
                      {isEditing && (
                        <button
                          onClick={() => removeArrayItem(setLanguages, index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiX className="text-xs" />
                        </button>
                      )}
                    </div>
                  ))}
                  {languages.length === 0 && (
                    <span className="text-gray-500 text-sm">
                      No languages added
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Professional Section */}
          {activeSection === "professional" && (
            <div className="space-y-8">
              <h2
                className={`text-2xl font-bold ${
                  mode ? "text-white" : "text-gray-800"
                } mb-6`}
              >
                Professional Information
              </h2>

              {/* Skills */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-500">
                    Skills & Expertise
                  </label>
                  {isEditing && (
                    <button
                      onClick={addSkill}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <FiPlus className="text-sm" /> Add Skill
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 px-3 py-2 ${
                        mode
                          ? "bg-blue-900 text-blue-300"
                          : "bg-blue-100 text-blue-800"
                      } rounded-lg`}
                    >
                      <span className="text-sm font-medium">{skill}</span>
                      {isEditing && (
                        <button
                          onClick={() => removeArrayItem(setSkills, index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiX className="text-xs" />
                        </button>
                      )}
                    </div>
                  ))}
                  {user.skills.length === 0 && (
                    <span className="text-gray-500 text-sm">
                      No skills added
                    </span>
                  )}
                </div>
              </div>

              {/* Specializations */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-500">
                    Teaching Specializations
                  </label>
                  {isEditing && (
                    <button
                      onClick={addSpecialization}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <FiPlus className="text-sm" /> Add Specialization
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {specializations.map((spec, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 px-3 py-2 ${
                        mode
                          ? "bg-green-900 text-green-300"
                          : "bg-green-100 text-green-800"
                      } rounded-lg`}
                    >
                      <span className="text-sm font-medium">{spec}</span>
                      {isEditing && (
                        <button
                          onClick={() =>
                            removeArrayItem(setSpecializations, index)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiX className="text-xs" />
                        </button>
                      )}
                    </div>
                  ))}
                  {user.specializations.length === 0 && (
                    <span className="text-gray-500 text-sm">
                      No specializations added
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Social Links Section */}
          {activeSection === "social" && (
            <div className="space-y-6">
              <h2
                className={`text-2xl font-bold ${
                  mode ? "text-white" : "text-gray-800"
                } mb-6`}
              >
                Social Media & Links
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                    <FiLinkedin className="text-blue-600" />
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedIn"
                    disabled={!isEditing}
                    value={linkedIn}
                    onChange={(e) => setLinkedIn(e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                      mode
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-50 text-gray-700"
                    } ${isEditing ? "focus:ring-2 focus:ring-blue-500" : ""}`}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                    <FiYoutube className="text-red-600" />
                    YouTube Channel
                  </label>
                  <input
                    type="url"
                    name="youtube"
                    disabled={!isEditing}
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    placeholder="https://youtube.com/c/yourchannel"
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                      mode
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-50 text-gray-700"
                    } ${isEditing ? "focus:ring-2 focus:ring-blue-500" : ""}`}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                    <FiTwitter className="text-blue-400" />
                    Twitter Profile
                  </label>
                  <input
                    type="url"
                    name="twitter"
                    disabled={!isEditing}
                    value={twitter}
                    onChange={(e) => settwitter(e.target.value)}
                    placeholder="https://twitter.com/yourusername"
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                      mode
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-50 text-gray-700"
                    } ${isEditing ? "focus:ring-2 focus:ring-blue-500" : ""}`}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                    <FiGlobe className="text-green-600" />
                    Personal Website
                  </label>
                  <input
                    type="url"
                    name="personal"
                    disabled={!isEditing}
                    value={personal}
                    onChange={(e) => setPersonal(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                      mode
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-50 text-gray-700"
                    } ${isEditing ? "focus:ring-2 focus:ring-blue-500" : ""}`}
                  />
                </div>
              </div>

              {/* Social Preview */}
              <div
                className={`p-6 ${
                  mode ? "bg-gray-800" : "bg-gray-50"
                } rounded-lg`}
              >
                <h3
                  className={`text-lg font-semibold ${
                    mode ? "text-white" : "text-gray-800"
                  } mb-4`}
                >
                  Social Media Preview
                </h3>
                <div className="flex gap-4">
                  {user?.linkedIn && (
                    <a
                      href={user.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <FiLinkedin /> LinkedIn
                    </a>
                  )}
                  {user?.youtube && (
                    <a
                      href={user.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <FiYoutube /> YouTube
                    </a>
                  )}
                  {user?.twitter && (
                    <a
                      href={user.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500"
                    >
                      <FiTwitter /> Twitter
                    </a>
                  )}
                  {user?.personal && (
                    <a
                      href={user.personal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <FiGlobe /> Website
                    </a>
                  )}
                </div>
                {!user?.linkedIn &&
                  !user?.youtube &&
                  !user?.twitter &&
                  !user?.personal && (
                    <p className="text-gray-500 text-sm">
                      No social links added yet
                    </p>
                  )}
              </div>
            </div>
          )}
          
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition ${
                  mode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={updateProfile}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <FiCheck /> Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className={`w-full sm:w-auto flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                mode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <FiEdit2 /> Edit Profile
            </button>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
