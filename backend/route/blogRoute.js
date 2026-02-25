import express from 'express'
import isAuth from '../middleware/isAuth.js'
import upload from '../middleware/multer.js'
import { createBlog, currentBlog, deleteBlog, getBlogs, updateblog, userBlog } from '../controller/blogController.js';

const blogRoute = express.Router();

blogRoute.post("/create",isAuth,upload.single("image"),createBlog)
blogRoute.get("/getBlogs",getBlogs)
blogRoute.post("/user-blogs",isAuth,userBlog)
blogRoute.post("/delete",isAuth,deleteBlog)
blogRoute.post("/update",isAuth,updateblog)
blogRoute.post("/current-blog",isAuth,currentBlog)

export default blogRoute