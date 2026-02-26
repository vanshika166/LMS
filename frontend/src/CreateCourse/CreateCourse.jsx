import React, { useContext, useEffect, useState } from "react";
import { appDataContext } from "../Context/AppContext.jsx";
import { CiImageOn } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { BiVideoRecording } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCourseData } from "../redux/courseSlice.js";
import { getCurrrentCourse } from "../redux/actions/userCoursesAction.js";
import { toast } from "react-toastify";
import Loader from "../Components/Loader.jsx";


const CreateCourse = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.app.mode);
  const course = useSelector((state) => state.course.getCurrentCourse);
  const isEdit = useSelector((state) => state.userCourseData.edit);
  const { id } = useParams();
  const { serverURL } = useContext(appDataContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Web development");
  const [level, setLevel] = useState("Begginer");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverVideo, setCoverVideo] = useState("");
  const [learning, setLearning] = useState([""]);
  const [outcome, setOutcome] = useState([""]);
  const [projects, setProjects] = useState([""]);
  const [highlights, sethighlights] = useState([""]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getCurrrentCourse(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (course && isEdit) {
      setTitle(course.title || "");
      setSlug(course.slug || "");
      setCategory(course.category || "Web development");
      setLevel(course.level || "Begginer");
      setDescription(course.description || "");
      setLongDescription(course.detailedDescription || "");
      setCoverImage(course.coverImage?.url || "");
      setCoverVideo(course.coverVideo?.url || "");
      setLearning(course?.learnings?.length ? course.learnings : [""]);
      sethighlights(course?.highlights?.length ? course.highlights : [""]);
      setOutcome(course?.outcomes?.length ? course.outcomes : [""]);
      setProjects(course?.projects?.length ? course.projects : [""]);
    }
  }, [course, isEdit]);

  useEffect(() => {
    setSlug(makeSlug(title))
  }, [title])
  
  // slug making:
  const makeSlug = (text)=>{
    return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-")
  }

  // learning
  const handleLearningInputs = (e) => {
    e.preventDefault();
    setLearning([...learning, ""]);
  };
  const onChangeLearning = (i, val) => {
    const newInput = [...learning];
    newInput[i] = val;
    setLearning(newInput);
  };
  const removeLearning = (e, index) => {
    e.preventDefault();
    const newInput = learning.filter((_, elem) => elem !== index);
    setLearning(newInput);
  };

  // highlights:
  const handleHighlightsInputs = (e) => {
    e.preventDefault();
    sethighlights([...highlights, ""]);
  };
  const onChangeHighlights = (i, val) => {
    const newInput = [...highlights];
    newInput[i] = val;
    sethighlights(newInput);
  };
  const removeHighlights = (e, index) => {
    e.preventDefault();
    const newInput = highlights.filter((_, elem) => elem !== index);
    sethighlights(newInput);
  };

  // outcomes:
  const handleOutcomsInputs = (e) => {
    e.preventDefault();
    setOutcome([...outcome, ""]);
  };
  const onChangeOutcomes = (i, val) => {
    const newInput = [...outcome];
    newInput[i] = val;
    setOutcome(newInput);
  };
  const removeOutcomes = (e, index) => {
    e.preventDefault();
    const newInput = outcome.filter((_, elem) => elem !== index);
    setOutcome(newInput);
  };

  // projects:
  const handleProjectsInputs = (e) => {
    e.preventDefault();
    setProjects([...projects, ""]);
  };
  const onChangeProjects = (i, val) => {
    const newInput = [...projects];
    newInput[i] = val;
    setProjects(newInput);
  };
  const removeProjects = (e, index) => {
    e.preventDefault();
    const newInput = projects.filter((_, elem) => elem !== index);
    setProjects(newInput);
  };

  // function to send data to the backend
  const createCourse = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("category", category);
    formData.append("level", level);
    formData.append("description", description);
    formData.append("coverImage", coverImage);
    formData.append("coverVideo", coverVideo);
    formData.append("detailedDescription", longDescription);

    learning.forEach((learn) => {
      if (learn.trim()) formData.append("learnings", learn);
    });
    highlights.forEach((high) => {
      if (high.trim()) formData.append("highlights", high);
    });
    outcome.forEach((out) => {
      if (out.trim()) formData.append("outcomes", out);
    });
    projects.forEach((project) => {
      if (project.trim()) formData.append("projects", project);
    });

    setLoading(true);

    try {
      const result = await axios.post(
        serverURL + "/api/course/create",
        formData,
        { withCredentials: true },
      );
      console.log(result);
      if (result) {
        setLoading(false);
        dispatch(setCourseData(result.data));
        console.log(result.data._id);
        navigate(`/teacher/upload-material/${result.data._id}`);
      }
    } catch (error) {
      setLoading(false);
      console.log("crate course error:", error);
      toast.error(error.response.data.error);
    }
  };

  // function to update the course content:
  const editCourse = async () => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("category", category);
    formData.append("level", level);
    formData.append("description", description);
    formData.append("detailedDescription", longDescription);
    formData.append("learnings", JSON.stringify(learning));
    formData.append("highlights", JSON.stringify(highlights));
    formData.append("outcomes", JSON.stringify(outcome));
    formData.append("projects", JSON.stringify(projects));

    if (coverImage instanceof File) formData.append("coverImage", coverImage);
    if (coverVideo instanceof File) formData.append("coverVideo", coverVideo);

    setLoading(true);
    try {
      const result = await axios.post(
        serverURL + "/api/course/update-course",
        formData,
        { withCredentials: true },
      );
      if (result) {
        setLoading(false);
        console.log(result.data);
        dispatch(setCourseData(result.data));
        navigate(`/teacher/upload-material/${id}`);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response.data.error);
    }
  };

  return loading ? (
    <div className="h-screen w-full flex flex-col gap-y-4 items-center justify-center bg bg-transparent">
      <Loader message="Saving your course details..." />
    </div>
  ) : (
    <div
      className={`h-screen overflow-auto w-full ${
        mode ? "bg-black" : "bg-gray-50"
      }`}
    >
      {/* bottom part */}
      <div className="w-full flex flex-col lg:flex-row">
        {/*form  */}
        <div className="lg:w-[60%] w-full p-6">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* title input */}
            <div className="flex flex-col gap-y-2">
              <label
                htmlFor="title"
                className={`text-sm font-medium ${
                  mode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Title
              </label>
              <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                placeholder="e.g. Introduction to Data Analytics"
                className={`border border-gray-300 ${
                  mode ? "bg-[#1F2024] text-gray-200" : "bg-white text-gray-800"
                } rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none`}
              />
            </div>

            {/* slug input */}
            <div className="flex flex-col gap-y-2">
              <label
                htmlFor="slug"
                className={`text-sm font-medium ${
                  mode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Slug
              </label>
              <input
                type="text"
                value={slug}
                readOnly
                placeholder="slug will appear here.."
                className={`border border-gray-300 ${
                  mode ? "bg-[#1F2024] text-gray-200" : "bg-white text-gray-800"
                } rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none`}
              />
            </div>

            {/* category and level input */}
            <div className="flex gap-x-6">
              <div className="flex flex-col gap-y-2 w-1/2">
                <label
                  className={`text-sm font-medium ${
                    mode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Category
                </label>
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                  className={`border border-gray-300 ${
                    mode
                      ? "bg-[#1F2024] text-gray-200"
                      : "bg-white text-gray-800"
                  } rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none`}
                >
                  <option value="web development">Web Development</option>
                  <option value="web designing">Web Designing</option>
                  <option value="data analytics">Data Analytics</option>
                  <option value="cyber security">Cyber Security</option>
                  <option value="Artificial Intelligence (AI)">
                    Artificial Intelligence (AI)
                  </option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="Game Development">Game Development</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Programming Languages">
                    Programming Languages
                  </option>
                  <option value="Mobile App Development">
                    Mobile App Development
                  </option>
                  <option value="Software Engineering">
                    Software Engineering
                  </option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Deep Learning">Deep Learning</option>
                  <option value="Blockchain Technology">
                    Blockchain Technology
                  </option>
                  <option value="Internet of Things (IoT)">
                    Internet of Things (IoT)
                  </option>
                  <option value="Augmented Reality (AR) & Virtual Reality (VR)">
                    Augmented Reality (AR) & Virtual Reality (VR)
                  </option>
                  <option value="Robotics & Automation">
                    Robotics & Automation
                  </option>
                  <option value="Quantum Computing">Quantum Computing</option>
                  <option value="DSA">
                    DSA (Data structures and algorithm)
                  </option>
                  <option value="DevOps">DevOps</option>
                  <option value="Cloud Security">Cloud Security</option>
                  <option value="Containerization (Docker & Kubernetes)">
                    Containerization (Docker & Kubernetes)
                  </option>
                  <option value="Site Reliability Engineering (SRE)">
                    Site Reliability Engineering (SRE)
                  </option>
                  <option value="Ethical Hacking">Ethical Hacking</option>
                  <option value="Network Administration">
                    Network Administration
                  </option>
                  <option value="Information Security">
                    Information Security
                  </option>

                  <option value="Embedded Systems">Embedded Systems</option>
                  <option value="Computer Vision">Computer Vision</option>
                  <option value="Natural Language Processing (NLP)">
                    Natural Language Processing (NLP)
                  </option>
                  <option value="Chatbot Development">
                    Chatbot Development
                  </option>
                  <option value="Prompt Engineering">Prompt Engineering</option>
                  <option value="Tech for Beginners">Tech for Beginners</option>
                </select>
              </div>

              <div className="flex flex-col gap-y-2 w-1/2">
                <label
                  className={`text-sm font-medium ${
                    mode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Level
                </label>
                <select
                  onChange={(e) => setLevel(e.target.value)}
                  value={level}
                  className={`border border-gray-300 ${
                    mode
                      ? "bg-[#1F2024] text-gray-200"
                      : "bg-white text-gray-800"
                  } rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none`}
                >
                  <option value="Begginer">Begginer</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advance">Advance</option>
                </select>
              </div>
            </div>

            {/* description input */}
            <div className="flex flex-col gap-y-2">
              <label
                className={`text-sm font-medium ${
                  mode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Write a small excerpt:
              </label>
              <textarea
                rows={3}
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className={`border border-gray-300 rounded-lg p-2 text-sm ${
                  mode ? "bg-[#1F2024] text-gray-200" : "bg-white text-gray-800"
                } shadow-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none resize-none`}
              ></textarea>
              <p className="text-xs text-gray-500">0/2000 characters</p>
            </div>

            <div className="flex flex-col gap-y-6 mt-6">
              {/* Long Description */}
              <div className="flex flex-col gap-y-2">
                <label
                  className={`text-sm font-medium ${
                    mode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  write a detailed description:
                </label>
                <textarea
                  rows={6}
                  onChange={(e) => setLongDescription(e.target.value)}
                  value={longDescription}
                  placeholder="Write a detailed description about your course..."
                  className={`border border-gray-300 rounded-lg p-2 text-sm ${
                    mode
                      ? "bg-[#1F2024] text-gray-200"
                      : "bg-white text-gray-800"
                  } shadow-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none resize-none`}
                ></textarea>
              </div>

              {/* learning ,highlights,outcomnes ,projects section */}
              {[
                {
                  title: "What You’ll Learn",
                  array: learning,
                  addFunc: handleLearningInputs,
                  onChangefunc: onChangeLearning,
                  removefunc: removeLearning,
                  type: "text",
                  placeholder:
                    "List the main skills or topics students will learn...",
                  tips: "Add or remove multiple learning outcomes to help students understand what they'll gain from this course.",
                },
                {
                  title: "Who This Course Is For",
                  array: highlights,
                  addFunc: handleHighlightsInputs,
                  onChangefunc: onChangeHighlights,
                  removefunc: removeHighlights,
                  type: "text",
                  placeholder:
                    "List the highlights for who this course is designed for...",
                  tips: " Clearly describe the type of learners this course is designed for.",
                },
                {
                  title: "Outcome",
                  array: outcome,
                  addFunc: handleOutcomsInputs,
                  onChangefunc: onChangeOutcomes,
                  removefunc: removeOutcomes,
                  type: "text",
                  placeholder:
                    "write what students will receive after completing this course...",
                  tips: "Highlight the key results learners will achieve by the end of this course.",
                },
                {
                  title: " Hands-On Projects ",
                  array: projects,
                  addFunc: handleProjectsInputs,
                  onChangefunc: onChangeProjects,
                  removefunc: removeProjects,
                  type: "text",
                  placeholder:
                    "Describe the projects students will build during this course...",
                  tips: "Showcase practical projects that let students apply their learning in real-world scenarios.",
                },
              ].map((section, index) => {
                return (
                  <div key={index} className="flex flex-col gap-y-3">
                    <div className="w-[40rem] flex items-center justify-between p-2">
                      <label
                        className={`text-sm font-semibold ${
                          mode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {section.title}
                      </label>

                      <button
                        onClick={section.addFunc}
                        type="button"
                        className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-all duration-300 shadow-md"
                      >
                        add
                      </button>
                    </div>

                    {/* inputs */}
                    {section.array.map((val, i) => {
                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-x-3 p-3 rounded-lg border ${
                            mode
                              ? "bg-[#1F2024] border-gray-700"
                              : "bg-white border-gray-300 shadow-sm"
                          }`}
                        >
                          <input
                            onChange={(e) =>
                              section.onChangefunc(i, e.target.value)
                            }
                            type={section.type}
                            value={val}
                            placeholder={section.placeholder}
                            className={`flex-1 rounded-md text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                              mode
                                ? "bg-[#2A2B2F] text-gray-200"
                                : "bg-gray-50 text-gray-800"
                            }`}
                          />

                          <div className="flex items-center gap-x-2">
                            <button
                              onClick={(e) => section.removefunc(e, i)}
                              type="button"
                              className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-all duration-300 shadow-md"
                            >
                              <MdDelete />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    <p className="text-xs text-gray-500">Tip:{section.tips}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex w-full justify-between items-center">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(isEdit);
                  isEdit ? editCourse() : createCourse();
                }}
                className="bg-[#2A27F3] font-semibold text-white hover:bg-[#0c09b5] transition-all duration-300 p-2 rounded-md px-5 font-Nunito"
              >
                Save and Continue
              </button>
            </div>
          </form>
        </div>

        {/* media inputs */}
        <div className="lg:w-[40%] w-full p-6 space-y-6">
          {/* image */}
          <div className="space-y-3 overflow-hidden">
            <h1
              className={`text-sm font-semibold ${
                mode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Cover Image
            </h1>

            <input
              type="file"
              id="coverImage"
              hidden
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
            />

            {coverImage === "" ? (
              <label
                htmlFor="coverImage"
                className={`w-full h-[13.5rem]  gap-x-2 text-sm flex flex-col items-center justify-center ${
                  mode
                    ? "bg-[#1F2024] hover:bg-[#1F2024]/50 text-gray-200"
                    : "text-gray-800 hover:bg-gray-100"
                } border-2 border-dashed rounded-xl cursor-pointer`}
              >
                <CiImageOn size={28} className="text-gray-500" />
                <h2 className="text-gray-600">Upload</h2>
              </label>
            ) : (
              <img
                src={coverImage}
                className="w-full h-[13.5rem] object-cover"
              />
            )}
          </div>

          {/* video */}
          <div className="space-y-3 overflow-hidden">
            <h1
              className={`text-sm font-semibold ${
                mode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Sales Video
            </h1>

            <input
              type="file"
              id="coverVideo"
              hidden
              accept="video/*"
              onChange={(e) => setCoverVideo(e.target.files[0])}
            />
            {coverVideo === "" ? (
              <label
                htmlFor="coverVideo"
                className={`w-full h-[13.5rem] gap-x-2 text-sm flex flex-col items-center justify-center ${
                  mode
                    ? "bg-[#1F2024] hover:bg-[#1F2024]/50 text-gray-200"
                    : " text-gray-800 hover:bg-gray-100"
                } border-2 border-dashed rounded-xl cursor-pointer`}
              >
                <BiVideoRecording size={28} className="text-gray-500" />
                <h2 className="text-gray-600">Upload</h2>
              </label>
            ) : (
              <video
                src={coverVideo}
                controls
                className="w-full h-[13.5rem] object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
