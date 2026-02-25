import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice.js';
import appReducer from './appSlice.js'
import courseReducer from './courseSlice.js'
import userCourseReducer from './userCourseSlice.js'
import userblogDataReducer from './userBlogSlice.js'


export const store = configureStore({
    reducer:{
        user:userReducer,
        app:appReducer,
        course:courseReducer,
        userCourseData:userCourseReducer,
        userBlogs:userblogDataReducer
    },
})
