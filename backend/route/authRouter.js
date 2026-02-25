import express from 'express';
import { GoogleAuthetication, login, logout, signup } from '../controller/authController.js';

const authRoute = express.Router();

authRoute.post("/signup",signup)
authRoute.post("/login",login)
authRoute.post("/googleauth",GoogleAuthetication)
authRoute.get("/logout",logout)

export default authRoute;