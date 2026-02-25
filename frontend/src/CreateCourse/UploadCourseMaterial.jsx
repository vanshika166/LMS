import React, { useState, useEffect, useContext } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { appDataContext } from "../Context/AppContext.jsx";
import { toast } from "react-toastify";
import { getCurrrentCourse } from "../redux/actions/userCoursesAction.js";
import Loader from "../Components/Loader.jsx";

const UploadCourseMaterial = () => {
  const { serverURL } = useContext(appDataContext);
  const mode = useSelector((state) => state.app.mode);
  const course = useSelector((state) => state.course.getCurrentCourse);
  const isEdit = useSelector((state) => state.userCourseData.edit);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getCurrrentCourse(id));
  }, [dispatch, id]);

  const [sections, setSections] = useState([
    {
      id: Date.now(),
      title: "",
      objective: "",
      lessons: [
        {
          id: Date.now(),
          title: "",
          type: "video",
          fileURL: null,
          learningObjective: "",
          textContent: "",
          duration: "",
        },
      ],
    },
  ]);

  useEffect(() => {
    if (course && isEdit) {
      setSections(course.sections || []);
    }
  }, [course, isEdit]);

  /* ---------------- SECTION HANDLERS ---------------- */

  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        id: Date.now(),
        title: "",
        objective: "",
        lessons: [
          {
            id: Date.now(),
            title: "",
            type: "video",
            fileURL: null,
            learningObjective: "",
            textContent: "",
            duration: "",
          },
        ],
      },
    ]);
  };

  const handleRemoveSection = (sectionId) => {
    setSections(sections.filter((s) => (s._id || s.id) !== sectionId));
  };

  const handleSectionChange = (id, value) => {
    setSections(
      sections.map((s) =>
        s._id === id || s.id === id ? { ...s, title: value } : s,
      ),
    );
  };

  const handleObjectiveChange = (id, value) => {
    setSections(
      sections.map((s) =>
        s._id === id || s.id === id ? { ...s, objective: value } : s,
      ),
    );
  };

  /* ---------------- LESSON HANDLERS ---------------- */

  const handleAddLesson = (sectionId) => {
    setSections(
      sections.map((s) =>
        s._id === sectionId || s.id === sectionId
          ? {
              ...s,
              lessons: [
                ...s.lessons,
                {
                  id: Date.now(),
                  title: "",
                  type: "video",
                  fileURL: null,
                  learningObjective: "",
                  textContent: "",
                  duration: "",
                },
              ],
            }
          : s,
      ),
    );
  };

  const handleLessonChange = (sectionId, lessonId, key, value) => {
    setSections(
      sections.map((s) =>
        s._id === sectionId || s.id === sectionId
          ? {
              ...s,
              lessons: s.lessons.map((l) =>
                l._id === lessonId || l.id === lessonId
                  ? { ...l, [key]: value }
                  : l,
              ),
            }
          : s,
      ),
    );
  };

  const handleRemoveLesson = (sectionId, lessonId) => {
    setSections(
      sections.map((s) =>
        s._id === sectionId || s.id === sectionId
          ? {
              ...s,
              lessons: s.lessons.filter((l) => (l._id || l.id) !== lessonId),
            }
          : s,
      ),
    );
  };

  /* ---------------- FILE ACCEPT ---------------- */

  const getAcceptFile = (type) => {
    if (type === "video") return "video/*";
    if (type === "image") return "image/*";
    return "*/*";
  };

  /* ---------------- FORM DATA ---------------- */

  const courseFormData = (sections, id) => {
    const formData = new FormData();
    formData.append("id", id);

    sections.forEach((section, sIndex) => {
      formData.append(`sections[${sIndex}][title]`, section.title);
      formData.append(`sections[${sIndex}][objective]`, section.objective);

      section.lessons.forEach((lesson, lIndex) => {
        formData.append(
          `sections[${sIndex}][lessons][${lIndex}][title]`,
          lesson.title,
        );
        formData.append(
          `sections[${sIndex}][lessons][${lIndex}][type]`,
          lesson.type,
        );
        formData.append(
          `sections[${sIndex}][lessons][${lIndex}][learningObjective]`,
          lesson.learningObjective || "",
        );
        formData.append(
          `sections[${sIndex}][lessons][${lIndex}][duration]`,
          lesson.duration || "",
        );
        formData.append(
          `sections[${sIndex}][lessons][${lIndex}][textContent]`,
          lesson.textContent || "",
        );

        if (lesson.fileURL instanceof File) {
          formData.append(
            `sections[${sIndex}][lessons][${lIndex}][fileURL]`,
            lesson.fileURL,
          );
        } else if (typeof lesson.fileURL === "string") {
          formData.append(
            `sections[${sIndex}][lessons][${lIndex}][fileURL]`,
            lesson.fileURL,
          );
        } else if (
          lesson.fileURL &&
          typeof lesson.fileURL === "object" &&
          !(lesson.fileURL instanceof File)
        ) {
          // preserve existing cloudinary object
          formData.append(
            `sections[${sIndex}][lessons][${lIndex}][fileURL][public_id]`,
            lesson.fileURL.public_id || "",
          );
          formData.append(
            `sections[${sIndex}][lessons][${lIndex}][fileURL][url]`,
            lesson.fileURL.url || "",
          );
        }
      });
    });

    return formData;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = courseFormData(sections, id);
      await axios.post(`${serverURL}/api/course/course-material`, formData, {
        withCredentials: true,
      });
      navigate(`/teacher/course-pricing/${id}`);
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const formData = courseFormData(sections, id);
      await axios.post(
        `${serverURL}/api/course/update-course-material`,
        formData,
        { withCredentials: true },
      );
      navigate(`/teacher/course-pricing/${id}`);
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div
        className={`h-screen flex flex-col items-center justify-center ${
          mode ? "bg-black text-white" : "bg-[#F6F5F8] text-black"
        }`}
      >
        <Loader message="Uploading course material..." />
        <p className="mt-3">Saving course material...</p>
      </div>
    );

  /* ---------------- UI ---------------- */

  return (
    <div
      className={`h-screen overflow-auto ${mode ? "bg-black" : "bg-[#F6F5F8]"}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* PAGE TITLE */}
        <div className="w-full flex items-center justify-between p-2">
          <h1
            className={`text-2xl font-semibold tracking-tight ${
              mode ? "text-white" : "text-gray-800"
            }`}
          >
            Upload Course Material
          </h1>

          <button
            onClick={handleAddSection}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg transition"
          >
            + Add Section
          </button>
        </div>

        {sections.map((section, sIndex) => (
          <div
            key={section._id || section.id}
            className={`rounded-2xl p-6 shadow-lg space-y-6 ${
              mode ? "bg-[#16171B]" : "bg-white"
            }`}
          >
            {/* SECTION HEADER */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-indigo-500">
                Section {sIndex + 1}
              </h2>
              <FiTrash2
                className="text-red-500 cursor-pointer hover:scale-110 transition"
                onClick={() => handleRemoveSection(section._id || section.id)}
              />
            </div>

            {/* SECTION DETAILS */}
            <div className="space-y-4">
              <input
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${
                  mode
                    ? "bg-[#2A2B32] border-gray-600 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="Section Title"
                value={section.title}
                onChange={(e) =>
                  handleSectionChange(section._id || section.id, e.target.value)
                }
              />

              <textarea
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border text-sm resize-none focus:ring-2 focus:ring-indigo-500 outline-none ${
                  mode
                    ? "bg-[#2A2B32] border-gray-600 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="What students will learn in this section"
                value={section.objective}
                onChange={(e) =>
                  handleObjectiveChange(
                    section._id || section.id,
                    e.target.value,
                  )
                }
              />
            </div>

            {/* LESSONS */}
            <div className="space-y-6">
              {section.lessons.map((lesson, lIndex) => (
                <div
                  key={lesson._id || lesson.id}
                  className={`rounded-2xl p-5 border space-y-4 ${
                    mode
                      ? "border-gray-700 bg-[#1C1D22]"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  {/* LESSON HEADER */}
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Lesson {lIndex + 1}</h3>
                    <FiTrash2
                      className="text-red-500 cursor-pointer hover:scale-110 transition"
                      onClick={() =>
                        handleRemoveLesson(
                          section._id || section.id,
                          lesson._id || lesson.id,
                        )
                      }
                    />
                  </div>

                  {/* LESSON TITLE */}
                  <input
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${
                      mode
                        ? "bg-[#2A2B32] border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="Lesson Title"
                    value={lesson.title}
                    onChange={(e) =>
                      handleLessonChange(
                        section._id || section.id,
                        lesson._id || lesson.id,
                        "title",
                        e.target.value,
                      )
                    }
                  />
                  {/* LESSON OBJECTIVE */}
                  <textarea
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl border text-sm resize-none focus:ring-2 focus:ring-indigo-500 outline-none ${
                      mode
                        ? "bg-[#2A2B32] border-gray-600 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="What students will learn in this lesson"
                    value={lesson.learningObjective}
                    onChange={(e) =>
                      handleLessonChange(
                        section._id || section.id,
                        lesson._id || lesson.id,
                        "learningObjective",
                        e.target.value,
                      )
                    }
                  />

                  {/* DURATION AND TYPE SELECT */}
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* DURATION */}
                    <div className="flex flex-col">
                      <label
                        className={`text-xs font-semibold mb-1 ${
                          mode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Lesson Duration (minutes)
                      </label>

                      <input
                        type="number"
                        min="1"
                        placeholder="e.g. 15"
                        onChange={(e) =>
                          handleLessonChange(
                            section._id || section.id,
                            lesson._id || lesson.id,
                            "duration",
                            e.target.value,
                          )
                        }
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition ${
                          mode
                            ? "bg-[#2A2B32] border-gray-600 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        }`}
                      />
                    </div>

                    {/* TYPE SELECT */}
                    <div className="flex flex-col">
                      <label
                        className={`text-xs font-semibold mb-1 ${
                          mode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Lesson Type
                      </label>

                      <select
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition ${
                          mode
                            ? "bg-[#2A2B32] border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        value={lesson.type}
                        onChange={(e) =>
                          handleLessonChange(
                            section._id || section.id,
                            lesson._id || lesson.id,
                            "type",
                            e.target.value,
                          )
                        }
                      >
                        <option value="video">📹 Video Lesson</option>
                        <option value="text">📝 Text / Assignment</option>
                        <option value="image">🖼 Image</option>
                      </select>
                    </div>
                  </div>

                  {/* TEXT CONTENT UI */}
                  {lesson.type === "text" ? (
                    <div
                      className={`rounded-2xl border shadow-md overflow-hidden ${
                        mode
                          ? "bg-[#1C1D22] border-gray-700"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      {/* HEADER */}
                      <div
                        className={`px-5 py-3 border-b flex justify-between items-center ${
                          mode
                            ? "bg-[#25262B] border-gray-700"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <h4
                          className={`font-semibold ${
                            mode ? "text-indigo-400" : "text-indigo-600"
                          }`}
                        >
                          Text Lesson / Assignment
                        </h4>
                        <span className="text-xs text-gray-500">
                          Article • Notes • Tasks
                        </span>
                      </div>

                      {/* BODY */}
                      <div className="p-5 space-y-4">
                        <textarea
                          rows={10}
                          placeholder={`Introduction:
                                  Explain the topic briefly.

                                  Questions:
                                  1. …
                                  2. …

                                  Instructions:
                                  • Clear answers
                                  • Use examples
                                  `}
                          value={lesson.textContent}
                          onChange={(e) =>
                            handleLessonChange(
                              section._id || section.id,
                              lesson._id || lesson.id,
                              "textContent",
                              e.target.value,
                            )
                          }
                          className={`w-full px-4 py-3 rounded-xl border text-sm resize-none leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-none ${
                            mode
                              ? "bg-[#2A2B32] border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />

                        <p className="text-xs text-gray-500">
                          Formatting & line breaks will appear exactly the same
                          to students
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* preview existing or newly chosen file */}
                      {lesson.fileURL && (
                        <div className="relative rounded-lg overflow-hidden">
                          <FiTrash2
                            className="absolute top-1 right-1 text-red-500 cursor-pointer z-10"
                            onClick={() =>
                              handleLessonChange(
                                section._id || section.id,
                                lesson._id || lesson.id,
                                "fileURL",
                                null,
                              )
                            }
                          />
                          {lesson.type === "video" ? (
                            <video
                              src={
                                lesson.fileURL instanceof File
                                  ? URL.createObjectURL(lesson.fileURL)
                                  : typeof lesson.fileURL === "object"
                                  ? lesson.fileURL.url
                                  : lesson.fileURL
                              }
                              controls
                              className="max-w-full max-h-60"
                            />
                          ) : (
                            <img
                              src={
                                lesson.fileURL instanceof File
                                  ? URL.createObjectURL(lesson.fileURL)
                                  : typeof lesson.fileURL === "object"
                                  ? lesson.fileURL.url
                                  : lesson.fileURL
                              }
                              alt="lesson"
                              className="max-w-full max-h-60"
                            />
                          )}
                        </div>
                      )}

                      <input
                        type="file"
                        accept={getAcceptFile(lesson.type)}
                        onChange={(e) =>
                          handleLessonChange(
                            section._id || section.id,
                            lesson._id || lesson.id,
                            "fileURL",
                            e.target.files[0],
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* ADD LESSON AND SECTION  BUTTON */}
            <div className="flex justify-between items-center pt-8">
              {/* ADD LESSON */}
              <button
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg transition"
                onClick={() => handleAddLesson(section._id || section.id)}
              >
                + Add Lesson
              </button>

              <button
                onClick={handleAddSection}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg transition"
              >
                + Add Section
              </button>
            </div>
          </div>
        ))}

        {/* SAVE BUTTON */}
        <div className="pt-6 flex items-center justify-between">
          <button
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg transition"
            onClick={()=>navigate(`/teacher/course-pricing/${id}`)}
          >
            Skip for now
          </button>
          <button
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg transition"
            onClick={isEdit ? handleUpdate : handleSubmit}
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadCourseMaterial;
