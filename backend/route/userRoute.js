import express from 'express'
import isAuth from '../middleware/isAuth.js'
import { educatorProfile, getCurrentUser, updateProfile } from '../controller/usercontroller.js'
import upload from '../middleware/multer.js'

const userRoute = express.Router()

userRoute.get("/getuser",isAuth,getCurrentUser)
userRoute.post("/profile",isAuth,upload.single("photoURL"),updateProfile)
userRoute.get("/educator/:id",isAuth,educatorProfile)

export default userRoute;