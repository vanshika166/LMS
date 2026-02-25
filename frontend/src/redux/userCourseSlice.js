import { createSlice } from "@reduxjs/toolkit";

const userCourseSlice = createSlice({
    name:"userCourses",
    initialState:{
        userCourseData:null,
        edit:false
    },
    reducers:{
        setUserCourseData:(state,action)=>{
            state.userCourseData = action.payload
        },
        setEdit:(state,action)=>{
            state.edit = action.payload;
        }
    }
})

export const {setUserCourseData,setEdit} = userCourseSlice.actions;

export default userCourseSlice.reducer;