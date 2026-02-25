import express from  'express';
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/connectDB.js';
import cookieParser from 'cookie-parser';
import authRoute from './route/authRouter.js';
import userRoute from './route/userRoute.js';
import resetRoute from './route/resetRoute.js';
import courseRoute from './route/courseRoute.js';
import blogRoute from './route/blogRoute.js';
import wishlistRoute from './route/wishlistRoute.js';
import enrollRoute from './route/enrollRoute.js';
import courseProgressRoute from './route/CourseProgressRoute.js';
import reviewRoute from './route/reviewRoute.js';
import notificationRoute from './route/notificationRoute.js';
dotenv.config()

const port = process.en.PORT || 5000;
const client = process.env.FRONTEND_URL;

const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:client,
    credentials:true
}))

app.use('/api/auth',authRoute)
app.use("/api/user",userRoute)
app.use("/api/reset",resetRoute)
app.use('/api/course',courseRoute)
app.use('/api/blog',blogRoute)
app.use('/api/wishlist',wishlistRoute)
app.use('/api/enroll',enrollRoute)
app.use("/api/progress",courseProgressRoute)
app.use("/api/review",reviewRoute)
app.use("/api/notification",notificationRoute)


app.get("/",(req,res)=>{
    res.send('Backend is running 🚀.')
})

app.listen(port,()=>{
    console.log(`server is running on port http://localhost:${port}`)
    connectDB()
})