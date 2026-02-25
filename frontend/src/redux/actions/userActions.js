import axios from "axios"
import { setUserData } from "../userSlice.js"

const serverURL = import.meta.env.VITE_SERVER_URL;

export const getCurrentUser = ()=> async(dispatch)=>{
    
    try {
        const result = await axios.get(serverURL + "/api/user/getuser",{withCredentials:true})
        dispatch(setUserData(result.data))
    } catch (error) {
        console.log("get CurrentUser error",error)
    }
}