import  {createSlice} from '@reduxjs/toolkit'

const userBlogSlice = createSlice({
    name:"blogs",
    initialState:{
        userBlogData:null,
        allBlogs:null,
        currentBlog:null
    },
    reducers:{
        setUserBlogData:(state,action)=>{
            state.userBlogData = action.payload
        },
        setAllBlogs:(state,action)=>{
            state.allBlogs = action.payload
        },
        setCurrentBlog:(state,action)=>{
            state.currentBlog = action.payload
        }
    }
})

export const {setUserBlogData,setAllBlogs,setCurrentBlog} = userBlogSlice.actions;
export default userBlogSlice.reducer;