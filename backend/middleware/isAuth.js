import jwt from 'jsonwebtoken'

export const isAuth = async(req,res,next)=>{
    try {
        const { token } = req.cookies;
        console.log("req.cookie",req.cookies)
        if(!token){
            return res.status(400).json("user does not have a token.")
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(400).json("user does not have a valid token.")
        }
        req.userId = decoded.userId
        next()
    } catch (error) {
        console.log("isAuth error:",error)
        return res.status(500).json({message:error.message})
    }
}

export default isAuth;