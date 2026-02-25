import express  from 'express';
import { resetPassword, sendOTP, verifyOTP } from '../controller/authController.js';

const resetRoute = express.Router()

resetRoute.post("/sendotp",sendOTP)
resetRoute.post("/verifyotp",verifyOTP)
resetRoute.post("/resetpassword",resetPassword)

export default resetRoute;