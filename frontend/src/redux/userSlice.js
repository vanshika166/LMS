import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{
        userData:null
    },
    reducers:{
        setUserData:(state,action)=>{
            state.userData = action.payload
        }
    }
})

// actions
export const {setUserData} = userSlice.actions;

// reducar
export default userSlice.reducer;