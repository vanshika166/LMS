import axios from "axios"
import {setEdit, setUserCourseData } from "../userCourseSlice.js"
import { setGetCurrentcourse } from "../courseSlice.js"
import{setAllCourses} from '../courseSlice.js'
import{setCategoryCourse} from '../courseSlice.js'

const serverURL = import.meta.env.VITE_SERVER_URL


// fucntion to get educator's all courses

export const getUserCourses =()=> async(dispatch)=>{
    try {
        const result = await axios.post(serverURL+'/api/course/all-courses',{},{withCredentials:true})
        if(result){
            dispatch(setUserCourseData(result.data.courseCreated))
        }
        
    } catch (error) {
        console.log("get userCourses error",error)
    }
}

// fucntion to get current course data:
export const getCurrrentCourse =(id)=> async(dispatch)=>{
    try {
        const result = await axios.post(serverURL+'/api/course/get-course',{id},{withCredentials:true})
        if(result){
            dispatch(setGetCurrentcourse(result.data))
            // console.log(result.data);
        }
    } catch (error) {
        console.log(error);
    }
}

// fucntion to get all courses
export const allCourses = ()=>async(dispatch)=>{
try {
    const result = await axios.get(serverURL+'/api/course/allUsersCourses',{withCredentials:true})
    dispatch(setAllCourses(result.data))
} catch (error) {
    console.log("All courses error: ",error);
}
}

// function to get category wise courses:
export const categoryCourses = (categorySlug)=>async(dispatch)=>{
    try {
        const result = await axios.post(serverURL+'/api/course/category',{categorySlug},{withCredentials:true})
        console.log(result)
        dispatch(setCategoryCourse(result.data))
    } catch (error) {
        console.log("category course error: ",error)
    }
}

// function to set the edit state:
export const handleEditState = ()=> async(dispatch)=>{
    dispatch(setEdit(true))
}