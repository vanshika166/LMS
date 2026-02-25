import  { useContext, useEffect, useState } from "react";
import {
  FaPlayCircle,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
  FaChevronDown,
  FaShoppingCart,
  FaSun,
} from "react-icons/fa";
import { MdNightlight } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { setmode } from "../redux/appSlice.js";
import UserProfile from "../Components/UserProfile.jsx";
import { getCurrrentCourse } from "../redux/actions/userCoursesAction.js";
import { getCurrentUser } from "../redux/actions/userActions.js";
import { appDataContext } from "../Context/AppContext.jsx";
import CourseCompletion from "../Components/CourseCompletion.jsx";
import GenerateCertificate from "../Components/GenerateCertificate.jsx";

const Classes = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { serverURL } = useContext(appDataContext);
  const courseData = useSelector((state) => state.course?.getCurrentCourse);
  const mode = useSelector((state) => state.app.mode);
  const user = useSelector((state) => state.user?.userData);

  const [expand, setExpand] = useState(false);
  const [media, setMedia] = useState(null);
  const [type, setType] = useState("");
  const [SectionIndex, setSectionIndex] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [isCourseDone, setIsCourseDone] = useState(false);

  console.log(courseData)
  
  useEffect(() => {
    if (!user?.courseProgress || !id) {
      setIsCourseDone(false);
      return;
    }

    const progress = user.courseProgress.find(
      (c) => c.course.toString() === id.toString()
    );

    if (progress?.CourseCompleted) {
      setIsCourseDone(true);
    }
  }, [user, id]);

  // Fetch current course
  useEffect(() => {
    if (id) dispatch(getCurrrentCourse(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (courseData?.sections?.length > 0) {
      const firstMedia =
        courseData.sections[SectionIndex]?.lessons?.[lessonIndex]?.fileURL?.url;
      const mediaType =
        courseData.sections[SectionIndex]?.lessons?.[lessonIndex]?.type;
      if (firstMedia) {
        setMedia(firstMedia);
      }
      if (mediaType) {
        setType(mediaType);
      }
    }
  }, [SectionIndex, lessonIndex, courseData]);

  // fucntion to mark as read:
  const markAsRead = async (courseId, sectionId, lessonId) => {
    try {
      const result = await axios.post(
        serverURL + "/api/progress/marked",
        { courseId, sectionId, lessonId },
        { withCredentials: true }
      );
      if (result) {
        // console.log(result.data);
        // refresh current user data so client reflects updated progress/completion
        dispatch(getCurrentUser());
      }
    } catch (error) {
      console.log("mark as completed error :", error);
      toast.error(error.response.data.error);
    }
  };

  //function for "next lesson":
  const handleNextLesson = () => {
    if (!courseData?.sections) return;

    let courseId = courseData._id;
    let sectionId = courseData.sections[SectionIndex]._id;
    let lessonId = courseData?.sections[SectionIndex].lessons[lessonIndex]._id;

    const totalSections = courseData.sections.length;
    const currentSectionLessons =
      courseData.sections[SectionIndex]?.lessons || [];
    const totalLessonsInCurrentSection = currentSectionLessons.length;

    // Agar current section mein aur lessons hain
    if (lessonIndex < totalLessonsInCurrentSection - 1 || lessonIndex == 0) {
      // Next lesson
      markAsRead(courseId, sectionId, lessonId);
      setLessonIndex((prev) => prev + 1);
    }
    // Agar current section ka last lesson hai
    else if (SectionIndex < totalSections - 1) {
      // Next section ki pehli lesson
      markAsRead(courseId, sectionId, lessonId);
      setSectionIndex((prev) => prev + 1);
      setLessonIndex(0);
      toast.success(`Module ${SectionIndex + 1} completed! Moving to next...`);
    }
    // Agar course completely khatam
    else {
      markAsRead(courseId, sectionId, lessonId);
      toast.success("Congratulations! You've completed the entire course!");
      // console.log(user);
    }
  };

  // function to manage previous lesson:
  const handlePreviousLesson = () => {
    if (!courseData?.sections) return;

    if (lessonIndex > 0) {
      // just go to previous lesson in same section
      setLessonIndex((prev) => {
        const newLesson = prev - 1;
        const newMedia =
          courseData.sections[SectionIndex]?.lessons?.[newLesson]?.fileURL?.url;
        const newType =
          courseData.sections[SectionIndex]?.lessons?.[newLesson]?.type;
        if (newMedia) setMedia(newMedia);
        if (newType) setType(newType);
        return newLesson;
      });
    } else if (SectionIndex > 0) {
      // move to previous section's last lesson
      const prevSectionIndex = SectionIndex - 1;
      const prevLessons = courseData.sections[prevSectionIndex]?.lessons || [];
      const lastIdx = Math.max(0, prevLessons.length - 1);
      setSectionIndex((prev) => prev - 1);
      setLessonIndex(lastIdx);
      const newMedia =
        courseData.sections[prevSectionIndex]?.lessons?.[lastIdx]?.fileURL?.url;
      const newType =
        courseData.sections[prevSectionIndex]?.lessons?.[lastIdx]?.type;
      if (newMedia) setMedia(newMedia);
      if (newType) setType(newType);
    } else {
      // already at very first lesson — nothing to do
    }
  };

  const currentLesson =
    courseData?.sections?.[SectionIndex].lessons?.[lessonIndex];
  const currentSection = courseData?.sections[SectionIndex];

  // console.log(user?.courseProgress)
  return (
    <>
      <div className={`flex flex-col ${mode ? "bg-black" : "bg-[#F7F8FA]"}`}>
        {/* Navbar */}
        <nav
          className={`p-4 px-6 z-50 fixed flex flex-wrap items-center justify-between ${
            mode ? "bg-black" : "bg-[#F7F8FA] border-gray-200"
          } w-full`}
        >
          {/* Left */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <h1 className="font-Nunito text-[#2A27F3] text-3xl">
              Learn
              <span className="text-[#92f64f] font-bold text-[2rem]">Z</span>y
            </h1>
            <span
              className={`${
                mode ? "text-gray-500" : "text-gray-400"
              } hidden sm:block`}
            >
              |
            </span>
            <h2
              className={`text-sm sm:text-base font-medium ${
                mode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {courseData?.title || "Loading..."}
            </h2>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 sm:gap-5 mt-3 sm:mt-0">
            {user?.courseProgress?.find(
              (c) => c.course.toString() === id && c.CourseCompleted
            ) && (
              <GenerateCertificate
                button="Get Certified"
                studentName={user?.username}
                courseName={courseData?.title}
              />
            )}

            {/* Mode Toggle */}
            <div
              onClick={() => dispatch(setmode())}
              className="mr-5 cursor-pointer"
            >
              {mode ? (
                <FaSun className="text-white" />
              ) : (
                <MdNightlight className="text-black" />
              )}
            </div>

            {/* Cart */}
            {user && Object.keys(user).length > 0 && (
              <button>
                <FaShoppingCart
                  className={`${mode ? "text-white" : "text-black"}`}
                />
              </button>
            )}

            {/* User Profile */}
            <UserProfile />
          </div>
        </nav>

        {/* Main Content */}
        <div
          className={`min-h-screen ${
            mode ? "bg-black" : "bg-[#F7F8FA]"
          } px-6 py-12 flex flex-col relative top-8 lg:flex-row gap-8`}
        >
          {/* Left - Video and Overview */}
          <div className="flex-1 space-y-6">
            {/* Video Player */}
            <div
              className={` ${
                mode ? "bg-[#1F2024]" : "bg-white"
              } rounded-2xl shadow-md overflow-hidden`}
            >
              <div className="aspect-video overflow-y-auto ">
                {media && type === "video" ? (
                  <video
                    className="w-full h-full object-cover"
                    controls
                    controlsList="nodownload"
                  >
                    <source src={media} type="video/mp4" />
                  </video>
                ) : media && type === "image" ? (
                  <img
                    src={media}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : type === "text" ? (
                  <div className="w-full flex justify-center px-4 py-6">
                    <div className="w-full max-w-3xl">
                      {/* Header */}
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-700">
                          📘 Lesson Content Preview
                        </h3>
                        <span className="text-xs text-gray-400">
                          Student View
                        </span>
                      </div>

                      {/* Content Card */}
                      <div className="bg-white overflow-y-auto rounded-2xl border border-gray-200 shadow-sm">
                        <div className="p-6 text-lg leading-relaxed text-gray-800 whitespace-pre-wrap">
                          {courseData?.sections?.[SectionIndex]?.lessons?.[
                            lessonIndex
                          ]?.textContent || "No content added yet."}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Loader message="Loading content..." />
                  </div>
                )}
              </div>
              <div className="p-5 border-t border-gray-700/20">
                <h2
                  className={`text-xl font-semibold ${
                    mode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {courseData?.title}
                </h2>
                <p
                  className={`text-sm ${
                    mode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {courseData?.sections?.[SectionIndex]?.lessons?.[lessonIndex]
                    ?.title || "Lesson"}
                </p>
              </div>
            </div>

            {/* Lesson Controls */}
            <div
              className={`flex justify-between items-center px-4 py-3 rounded-xl ${
                mode ? "bg-[#1F2024]" : "bg-white"
              } shadow-sm`}
            >
              <button
                onClick={() => handlePreviousLesson()}
                className={`flex items-center gap-2 text-sm font-medium ${
                  mode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-black"
                }`}
              >
                <FaArrowLeft /> Previous Lesson
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    markAsRead(
                      courseData?._id,
                      currentSection?._id,
                      currentLesson?._id
                    )
                  }
                  className="bg-[#2A27F3] hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Mark as Complete
                </button>
                <button
                  onClick={() => handleNextLesson()}
                  className={`flex items-center gap-2 text-sm font-medium ${
                    mode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-700 hover:text-black"
                  }`}
                >
                  Next Lesson <FaArrowRight />
                </button>
              </div>
            </div>

            {/* Overview */}
            <div
              className={`${
                mode ? "bg-[#1F2024]" : "bg-white"
              } rounded-2xl shadow-md p-6`}
            >
              <h3
                className={`text-lg font-semibold mb-3 ${
                  mode ? "text-white" : "text-gray-900"
                }`}
              >
                Overview
              </h3>
              <p
                className={`${
                  mode ? "text-gray-300" : "text-gray-700"
                } leading-relaxed text-sm`}
              >
                {courseData?.sections?.[0]?.objective ||
                  "No overview available"}
              </p>
            </div>

            {/* learning objective */}
            <div
              className={`${
                mode ? "bg-[#1F2024]" : "bg-white"
              } rounded-2xl shadow-md p-6`}
            >
              <h3
                className={`text-lg font-semibold mb-3 ${
                  mode ? "text-white" : "text-gray-900"
                }`}
              >
                What You’ll Learn in This Lesson
              </h3>
              <p
                className={`${
                  mode ? "text-gray-300" : "text-gray-700"
                } leading-relaxed text-sm`}
              >
                {courseData?.sections?.[SectionIndex]?.lessons?.[lessonIndex]
                  .learningObjective || "No overview available"}
              </p>
            </div>
          </div>

          {/* Right - Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            <div
              className={`${
                mode ? "bg-[#1F2024]" : "bg-white"
              } rounded-2xl shadow-md p-5 sticky top-20`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`font-semibold ${
                    mode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Class Chapters
                </h3>
                <button
                  onClick={() => setExpand(!expand)}
                  className="text-blue-500 text-sm font-medium hover:underline"
                >
                  {expand ? "Hide" : "See all"}
                </button>
              </div>

              <div className="space-y-3">
                {courseData?.sections?.map((sec, i) => (
                  <details
                    key={i}
                    open={expand}
                    className={`rounded-lg overflow-hidden border ${
                      mode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <summary
                      className={`flex justify-between items-center cursor-pointer px-3 py-2 text-sm font-medium ${
                        mode
                          ? "text-gray-200 hover:bg-gray-800"
                          : "text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      {sec.title}
                      <FaChevronDown className="transition-transform duration-200 group-open:rotate-180" />
                    </summary>

                    <div
                      className={`pl-5 pr-3 pb-3 space-y-2 ${
                        mode ? "bg-[#25262A]" : "bg-gray-50"
                      }`}
                    >
                      {sec.lessons.map((lesson, idx) => {
                        const isCompleted = user?.courseProgress
                          ?.find(
                            (cp) => cp.course.toString() === courseData._id
                          )
                          ?.sections?.find(
                            (s) => s.sectionId.toString() === sec._id
                          )
                          ?.completedLessons?.some(
                            (l) => l.lessonId.toString() === lesson._id
                          );

                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              setSectionIndex(i);
                              setLessonIndex(idx);
                              setMedia(lesson.fileURL);
                            }}
                            className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer ${
                              SectionIndex === i && lessonIndex === idx
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-100 text-black"
                            }`}
                          >
                            {isCompleted ? (
                              <FaCheckCircle className="text-green-500" />
                            ) : (
                              <FaPlayCircle className="text-gray-500" />
                            )}
                            <span>{lesson.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isCourseDone && isCourseDone === true && (
        <CourseCompletion
          courseTitle={courseData?.title}
          userName={user?.username}
          onClose={() => setIsCourseDone(false)}
        />
      )}
    </>
  );
};

export default Classes;
