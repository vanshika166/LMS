import axios from "axios"
import { setAllBlogs, setCurrentBlog, setUserBlogData } from "../userBlogSlice.js"
const serverURL = import.meta.env.VITE_SERVER_URL;

export const getUserBlogs =()=> async(dispatch)=>{
    try {
        const result = await axios.post(serverURL+ '/api/blog/user-blogs',{},{withCredentials:true})
         dispatch(setUserBlogData(result.data.blogs))
    } catch (error) {
        console.log("user blogs  error: ",error)
    }
}

export const getAllBlogs = ()=>async(dispatch)=>{
    try {
        const result = await axios.get(serverURL+'/api/blog/getBlogs',{withCredentials:true})
        console.log(result.data);
        dispatch(setAllBlogs(result.data))
    } catch (error) {
        console.log("get allblogs error: ",error)
    }
}

export const getCurrentBlog= (id)=>async(dispatch)=>{
    try {
        const result = await axios.post(serverURL+'/api/blog/current-blog',{id},{withCredentials:true})
        console.log(result.data);
        dispatch(setCurrentBlog(result.data))
    } catch (error) {
         console.log("get currentBlog error: ",error)
    }
}