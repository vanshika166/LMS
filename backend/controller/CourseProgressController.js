import User from "../model/userModel.js";
import Course from "../model/courseModel.js";

// function to add the course in course progress list:
export const addTOCourseProgress = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json("course id is required.");
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json("User not found.");
    }
    const course = await Course.findById(id);
    if (!course) {
      return res.status(400).json("course not found.");
    }

    const exist = user.courseProgress.find((c) => c.course.toString() === id);
    if (exist) {
      let checkCourseCompletion = exist.CourseCompleted;
      if (checkCourseCompletion) {
        return res.status(200).json("course is completed.");
      }
      return res.status(200).json({ messgae: "Already added", data: user });
    }

    user.courseProgress.push({
      course: id,
      sections: [],
      overAllProgress: 0,
      CourseCompleted: false,
    });
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.log("add to course progress error: ", error);
    return res.status(500).json({ error: error.message });
  }
};

// function to manage the course progress:
export const markAsRead = async (req, res) => {
  try {
    const { courseId, sectionId, lessonId } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(400).json("user not found");
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(400).json("course not found");
    }

    // check if course included in user's course progress:
    let courseProgress = user.courseProgress.find(
      (c) => c.course.toString() === courseId
    );
    if (!courseProgress) {
      courseProgress = {
        course: courseId,
        sections: [],
        overAllProgress: 0,
        lastAccessed: Date.now(),
      };
      user.courseProgress.push(courseProgress);
    }

    // check if the section is inclded inside the course:
    let sectionProgress = courseProgress.sections.find(
      (s) => s.sectionId.toString() === sectionId
    );
    if (!sectionProgress) {
      sectionProgress = {
        sectionId,
        completedLessons: [],
        isCompleted: false,
      };
      courseProgress.sections.push(sectionProgress);
    }

    // check if the lesson exist inside the sections:
    let lessonProgress = sectionProgress.completedLessons.find(
      (l) => l.lessonId.toString() === lessonId
    );
    if (!lessonProgress) {
      lessonProgress = {
        lessonId,
        completed: true,
        createdAt: Date.now(),
      };
      sectionProgress.completedLessons.push(lessonProgress);
    }

    // check if section is completed or not:
    let sectionInCourse = course.sections.id(sectionId);
    if (sectionInCourse) {
      let totalLessons = sectionInCourse.lessons.length;
      let completedLessons = sectionProgress.completedLessons.length;
      sectionProgress.isCompleted = completedLessons === totalLessons;

      console.log(completedLessons);
    }

    // check all over progress of course:
    let totalLessons = 0
    if(course.sections && course.sections.length !== 0 ){
      course.sections.forEach((s)=>{
        if(s.lessons && s.lessons.length !==0){
          totalLessons += s.lessons.length;
        }
      })
    }

    let completedLessons = 0
    if(courseProgress.sections && courseProgress.sections.length !==0){
      courseProgress.sections.forEach((s)=>{
        completedLessons += s.completedLessons.length
      })
    }

    let progress = totalLessons >0 ? Math.round((completedLessons / totalLessons)*100):0

    courseProgress.overAllProgress = progress
    // mark course as completed when progress reaches 100%
    if (progress === 100) {
      courseProgress.CourseCompleted = true;
      courseProgress.completedAt = Date.now();
    } else {
      courseProgress.CourseCompleted = false;
      courseProgress.completedAt = null;
    }

    await user.save();
    
    return res.status(200).json(user.courseProgress);
  } catch (error) {
    console.log("mark As read error: ", error);
    return res.status(500).json({ error: error.message });
  }
};
