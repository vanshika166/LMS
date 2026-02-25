import express from 'express'
import isAuth from '../middleware/isAuth.js';
import {freeCourseEnroll, StudentCount, userenrolledcourses } from '../controller/EnrollController.js';

const enrollRoute = express.Router();

enrollRoute.post("/enroll-freeCourse",isAuth,freeCourseEnroll);
enrollRoute.post("/user-enroll-courses",isAuth,userenrolledcourses);
enrollRoute.post("/all-student",isAuth,StudentCount);

export default enrollRoute;