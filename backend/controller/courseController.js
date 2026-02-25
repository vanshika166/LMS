import Course from "../model/courseModel.js";
import {
  uploadOnCloudinary,
  destroyFromCloudinary,
} from "../config/cloudinary.js";
import User from "../model/userModel.js";

// function to create a course:
export const createCourse = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      title,
      category,
      level,
      slug,
      description,
      detailedDescription,
      learnings,
      highlights,
      outcomes,
      projects,
    } = req.body;

    if ((!title, !description, !level, !category)) {
      return res.status(400).json("please fill all the details.");
    }

    let coverImage = "";
    let coverVideo = "";

    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      coverImage = await uploadOnCloudinary(req.files.coverImage[0].path);
    }
    if (req.files && req.files.coverVideo && req.files.coverVideo[0]) {
      coverVideo = await uploadOnCloudinary(req.files.coverVideo[0].path);
    }

    let categorySlug = category
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    const course = await Course.create({
      title,
      category,
      categorySlug,
      level,
      description,
      slug,
      detailedDescription,
      coverImage: {
        public_id: coverImage.public_id,
        url: coverImage.secure_url,
      },
      educator: userId,
      coverVideo: {
        public_id: coverVideo.public_id,
        url: coverVideo.secure_url,
      },
      learnings,
      highlights,
      outcomes,
      projects,
    });

    await User.findByIdAndUpdate(
      userId,
      { $push: { courseCreated: course._id } },
      { new: true },
    );

    return res.status(201).json(course);
  } catch (error) {
    console.log(("create Course error:", error));
    return res.status(500).json({ error: error.message });
  }
};
// function to update the course details:
export const updateCreateCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      detailedDescription,
      category,
      slug,
      level,
      learnings,
      projects,
      outcomes,
      highlights,
      id,
    } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(400).json("User not authorized.");

    const course = await Course.findById(id);
    if (!course) return res.status(400).json("Course not found.");

    if (String(course.educator) !== String(req.userId))
      return res.status(403).json("User not authorized to update this course.");

    let coverImage = course.coverImage;
    let coverVideo = course.coverVideo;

    let categorySlug = category
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      coverImage = await uploadOnCloudinary(req.files.coverImage[0].path);

      course.coverImage = {
        public_id: coverImage.public_id,
        url: coverImage.secure_url,
      };
    }
    
    if (req.files && req.files.coverVideo && req.files.coverVideo[0]) {
      coverVideo = await uploadOnCloudinary(req.files.coverVideo[0].path);

      course.coverVideo = {
        public_id: coverVideo.public_id,
        url: coverVideo.secure_url,
      };
    }

    if (typeof title === "string" && title.trim() !== "") course.title = title;
    if (typeof slug === "string" && slug.trim() !== "") course.slug = slug;
    if (typeof description === "string" && description.trim() !== "")
      course.description = description;
    if (
      typeof detailedDescription === "string" &&
      detailedDescription.trim() !== ""
    )
      course.detailedDescription = detailedDescription;
    if (typeof category === "string" && category.trim() !== "")
      course.category = category;
    course.categorySlug = categorySlug;
    if (typeof level === "string" && level.trim() !== "") course.level = level;
    if (typeof learnings === "string") course.learnings = JSON.parse(learnings);
    if (typeof highlights === "string")
      course.highlights = JSON.parse(highlights);
    if (typeof outcomes === "string") course.outcomes = JSON.parse(outcomes);
    if (typeof projects === "string") course.projects = JSON.parse(projects);

    await course.save();

    return res
      .status(200)
      .json({ message: "Data updated successfully", Data: course });
  } catch (error) {
    console.log("update course error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// function to create course sections:
export const CourseSections = async (req, res) => {
  try {
    const { id, sections } = req.body;
    const files = req.files || [];

    console.log("req.body:", req.body);
    console.log(
      "req.files:",
      req.files.map((f) => f.fieldname),
    );

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json("User is not authorized.");
    }

    for (const file of files) {
      const match = file.fieldname.match(
        /sections\[(\d+)\]\[lessons\]\[(\d+)\]\[fileURL\]/,
      );
      if (match) {
        const [_, sec, les] = match;

        const upload = await uploadOnCloudinary(file.path);
        console.log(upload);

        if (sections[sec] && sections[sec].lessons[les] && upload) {
          sections[sec].lessons[les].fileURL = {
            public_id: upload.public_id,
            url: upload.secure_url,
          };
        }
      }
    }

    const course = await Course.findByIdAndUpdate(
      id,
      { $push: { sections: { $each: sections } } },
      { new: true },
    );
    return res.status(200).json({ message: "DONE", data: course });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error parsing form data" });
  }
};
// function to update the course sections:
export const updateCourseSections = async (req, res) => {
  try {
    const { id, sections } = req.body;
    const files = req.files;

    // console.log("files: ",files);
    console.log("body: ", req.body);

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json("user not found!");
    }
    const course = await Course.findById(id);
    if (!course) {
      return res.status(400).json("Course not found.");
    }
    if (String(course.educator) !== String(req.userId)) {
      return res.status(400).json("User not authorized to update the course.");
    }

    if (files) {
      for (const file of files) {
        const match = file.fieldname.match(
          /sections\[(\d+)\]\[lessons\]\[(\d+)\]\[fileURL\]/,
        );
        if (match) {
          const upload = await uploadOnCloudinary(file.path);

          const [_, sec, les] = match;
          if (sections[sec] && sections[sec].lessons[les] && upload) {
            sections[sec].lessons[les].fileURL = {
              public_id: upload.public_id,
              url: upload.secure_url,
            };
          }
        }
      }
    }

    if (sections) course.sections = sections;
    await course.save();

    return res.status(200).json({ message: "data updated.", Data: course });
  } catch (error) {
    console.log("update course section: ", error);
    res.status(500).json({ message: "Error parsing form data" });
  }
};

// function to add price for the course:
export const coursePrice = async (req, res) => {
  try {
    const userId = req.userId;
    const { id, price, discount, isFree } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json("user not authenticated.");
    }
    const course = await Course.findByIdAndUpdate(
      id,
      { $set: { price, discount, isFree } },
      { new: true },
    );
    if (!course) {
      return res.status(400).json("Course not found.");
    }

    return res
      .status(200)
      .json({ message: "updated successfully", Data: course });
  } catch (error) {
    console.log(("create Course error:", error));
    return res.status(500).json({ error: error.message });
  }
};
// fucntion to update the price of the course:
export const updatePrice = async (req, res) => {
  try {
    const { id, price, discount, isFree } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json("user not authenticated.");
    }
    const course = await Course.findById(id);
    if (!course) {
      return res.status(400).json("course not Found.");
    }
    if (price) course.price = price;
    if (discount) course.discount = discount;
    course.isFree = isFree;

    await course.save();

    return res.status(200).json(course);
  } catch (error) {
    console.log(("create Course error:", error));
    return res.status(500).json({ error: error.message });
  }
};

// function to publish the course:
export const coursePublish = async (req, res) => {
  try {
    const userId = req.userId;
    const { id, isPublished } = req.body;

    const course = await Course.findByIdAndUpdate(
      id,
      { $set: { isPublished } },
      { new: true },
    );

    if (!course) {
      return res.status(400).json("course not found");
    }

    return res.status(200).json(course);
  } catch (error) {
    console.log("publish course error: ", error);
    return res.status(500).json({ error: error.message });
  }
};

// function to get educator's courses:
export const getUserCourses = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId)
      .select("courseCreated")
      .populate("courseCreated");
    return res.status(200).json(user);
  } catch (error) {
    console.log("get user'Courses error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// function to get all the courses:
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate(
      "educator",
      "username",
    );
    return res.status(200).json(courses);
  } catch (error) {
    console.log(("all coursesCourses error:", error));
    return res.status(500).json({ error: error.message });
  }
};

// function to delete the course:
export const deleteCourse = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.body;

    if (!id) {
      return res.status(400).json("Course id is required.");
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(400).json("course does not exist.");
    }

    // update for creator:
    await User.findByIdAndUpdate(userId, {
      $pull: { courseCreated: course._id },
    });

    // update for all enrolled students:
    await User.updateMany(
      { enrolledCourses: course._id },
      { $pull: { enrolledCourses: course._id } },
    );

    // delete cover image and cover video from cloudinary:
    if (course?.coverImage?.public_id) {
      await destroyFromCloudinary(course.coverImage.public_id, "image");
    }
    if (course?.coverVideo?.public_id) {
      await destroyFromCloudinary(course.coverVideo.public_id, "video");
    }

    // delete video and images lessons from cloudinary:
    if (course?.sections && course.sections.length > 0) {
      for (let section of course.sections) {
        if (section.lessons && section.lessons.length > 0) {
          for (let lesson of section.lessons) {
            if (lesson.fileURL?.public_id) {
              await destroyFromCloudinary(
                lesson.fileURL.public_id,
                lesson.type,
              );
            }
          }
        }
      }
    }

    await Course.deleteOne({ _id: id });

    return res.status(200).json("course deleted Successfully.");
  } catch (error) {
    console.log(("delete course error:", error));
    return res.status(500).json({ error: error.message });
  }
};

// function get course details by Id:
export const getCourseByID = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json("not an Authorized user.");
    }
    const course = await Course.findById(id)
      .populate({
        path: "educator",
        select: "username photoURL",
      })
      .populate({
        path: "reviews.userId",
        select: "username photoURL",
      });

    if (!course) {
      return res.status(400).json("Course not found.");
    }
    return res.status(200).json(course);
  } catch (error) {
    console.log(("Get course by id error:", error));
    return res.status(500).json({ error: error.message });
  }
};

// function to get courses based on the category:
export const categoryCourses = async (req, res) => {
  try {
    const { categorySlug } = req.body;
    console.log(categorySlug);
    const courses = await Course.find({ categorySlug });
    if (courses) {
      return res.status(200).json(courses);
    }
    return res.status(400).json("No result found");
  } catch (error) {
    console.log(("category Courses:", error));
    return res.status(500).json({ error: error.message });
  }
};
