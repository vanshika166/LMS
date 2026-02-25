import express from 'express'
import { addTOCourseProgress, markAsRead } from '../controller/CourseProgressController.js';
import isAuth from '../middleware/isAuth.js'

 const courseProgressRoute = express.Router();

 courseProgressRoute.post("/add-progress",isAuth,addTOCourseProgress);
 courseProgressRoute.post("/marked",isAuth,markAsRead)

 export default courseProgressRoute;