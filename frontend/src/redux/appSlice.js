import { createSlice } from "@reduxjs/toolkit";

const getInitialMode = ()=>{
    const mode = localStorage.getItem("mode");
    return mode ? JSON.parse(mode):false;
}
 const appSlice = createSlice({
    name:"app",
    initialState:{
        mode:getInitialMode(),
    },
    reducers:{
        setmode:(state)=>{
            state.mode = !state.mode
        }
    }
})

// actions
export const {setmode} = appSlice.actions

// reducers 
export default appSlice.reducer
