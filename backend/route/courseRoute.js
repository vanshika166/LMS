import express from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { categoryCourses, coursePrice,coursePublish,CourseSections,createCourse,deleteCourse,getAllCourses,getCourseByID,getUserCourses, updateCourseSections, updateCreateCourse, updatePrice,} from "../controller/courseController.js";

const courseRoute = express.Router();

courseRoute.post("/create",isAuth,upload.fields([{ name: "coverImage", maxCount: 1 },{ name: "coverVideo", maxCount: 1 },]),createCourse);
courseRoute.post("/update-course",isAuth,upload.fields([{name:"coverImage",maxCount:1},{name:"coverVideo",maxCount:1}]),updateCreateCourse);
courseRoute.post("/all-courses", isAuth, getUserCourses);
courseRoute.post("/course-price",isAuth,coursePrice);
courseRoute.post("/update-price",isAuth,updatePrice)
courseRoute.post("/course-publish",isAuth,coursePublish)
courseRoute.post("/delete-course",isAuth,deleteCourse)
courseRoute.post("/get-course",isAuth,getCourseByID)
courseRoute.get("/allUsersCourses",getAllCourses)
courseRoute.post("/course-material",isAuth,upload.any(),CourseSections)
courseRoute.post("/update-course-material",isAuth,upload.any(),updateCourseSections)
courseRoute.post('/category',categoryCourses)
export default courseRoute;
