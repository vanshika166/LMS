import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
    name:"course",
    initialState:{
        courseData:null,
        getCurrentCourse:null,
        allCourses:null,
        categoryCourse:null
    },
    reducers:{
        setCourseData:(state,action)=>{
            state.course = action.payload
        },
        setGetCurrentcourse:(state,action)=>{
            state.getCurrentCourse = action.payload
        },
        setAllCourses:(state,action)=>{
            state.allCourses = action.payload
        },
        setCategoryCourse:(state,action)=>{
            state.categoryCourse = action.payload
        }

    }
})

export const {setCourseData,setGetCurrentcourse,setAllCourses,setCategoryCourse} = courseSlice.actions;
export default courseSlice.reducer;