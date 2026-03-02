import validator from "validator";
import User from "../model/userModel.js";
import generateToken from "../config/token.js";
import bcrypt from 'bcryptjs'
import sendMail from "../config/sendMail.js";

// function for signup
export const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if ((!username, !email, !password)) {
      return res
        .status(400)
        .json({ message: "all required details are not filled." });
    }

    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(400).json({ message: "user already exist." });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Email is not valid." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password should be 8 characters long." });
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      role,
      password: hashedPassword,
    });

    const token =  generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, 
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json(user);
    const userId = user._id
  } catch (error) {
    console.log("signup error:", error);
    res.status(500).json({ error: error.message });
  }
};

// function for login:

export const login = async(req,res)=>{
    try {
        const {email, password} = req.body;

        const existUser = await User.findOne({email});

        if(!validator.isEmail(email)){
            return res.status(400).json({message:"Email type is not valid"})
        }
        if(!existUser){
            return res.status(400).json({message:"user does not exist."})
        }

        const isPassword = await bcrypt.compare(password, existUser.password)
        if(!isPassword){
            return res.status(400).json({message:"Incorrect password."})
        }
        const token = generateToken(existUser._id)
        
        res.cookie("token",token,{
          httpOnly: true,
          secure: true, 
          sameSite: "None,
          maxAge:7 * 24 * 60 * 60* 1000
        })

        res.status(200).json({message:'login successfully.'})
        
    } catch (error) {
        console.log("login error:", error);
    res.status(500).json({ error: error.message });
    }
}

//function for logout 

export const logout = async(req,res)=>{
  try {
    await res.clearCookie("token",{
      httpOnly: true,
      secure: true, 
      sameSite: "None
    })
    return res.status(200).json({message:"logout successfully !"})
  } catch (error) {
    console.log("Logout error:",error)
    return res.status(500).json({error:error.message})
  }
}

// function for Google authentication

export const GoogleAuthetication = async(req,res)=>{
  try {
    const {username, email, role} = req.body;
    const varifyUser = await User.findOne({email})
    
    if(!varifyUser){
    const user = await User.create({username,email, role})
    return res.status(201).json(user)
    }
     const token = generateToken(varifyUser._id)
        
        res.cookie("token",token,{
          httpOnly: true,
          secure: true, 
          sameSite: "None
          maxAge:7 * 24 * 60 * 60* 1000
        })
    return res.status(200).json("loggedIn successfully.")
    
  } catch (error) {
    console.log("google auth error:",error)
    return res.status(500).json({message:error.message})
  }
}

// function to send "OTP" to the user

export const sendOTP = async(req,res)=>{
  try {
    const {email} = req.body;
    const verifyUser = await User.findOne({email})

    if(!verifyUser){
      return res.status(400).json("user not found")
    }

    const generateToken = Math.floor(1000 + Math.random()*9000).toString();
     verifyUser.resetOtp = generateToken;
     verifyUser.OtpExpire = Date.now()+ 5* 60 *1000
     verifyUser.isOtpVerify = false

     await verifyUser.save();

    await sendMail(email,generateToken);
    return res.status(200).json("OTP sent.")

  } catch (error) {
    console.log("OTP verify error:",error)
    return res.status(500).json({error:error.message})
  }
}

// function to verify "OTP" for the user

export const verifyOTP = async(req,res)=>{
  try {
    const {email,otp} = req.body;
    const verifyUser = await User.findOne({email})
    if(!verifyUser || verifyUser.resetOtp != otp || verifyUser.OtpExpire < Date.now()){
      return res.status(400).json("the token is Expired.")
    }
    verifyUser.isOtpVerify = true
    verifyUser.resetOtp = undefined;
     verifyUser.OtpExpire = undefined;

     await verifyUser.save();

     return res.status(200).json("OTP verified Successfully.")
   
    
  } catch (error) {
    console.log("verifyOTP error:",error)
    return res.status(500).json({error:error.message})
  }
}

// funxtion to reset password for the user

export const resetPassword = async(req,res)=>{
  try {
    const {email,password} = req.body;
    const verifyUser = await User.findOne({email});

    if(!verifyUser || !verifyUser.isOtpVerify){
      return res.status(400).json("you haven'nt verified the OTP yet.")
    }

    const hashedPassword = await bcrypt.hash(password,10)

    verifyUser.password = hashedPassword;
    verifyUser.isOtpVerify = false;

    await verifyUser.save();
    const token = generateToken(verifyUser._id)
    res.cookie("token",token,{
      httpOnly: true,
      secure: true, 
      sameSite: "None
      maxAge: 7 * 24 *60 * 60* 1000
    })

    return res.status(200).json("password is updated successfully.")
    
  } catch (error) {
    console.log("reset password error:",error)
    return res.status(500).json({error:error.message})
  }
}
