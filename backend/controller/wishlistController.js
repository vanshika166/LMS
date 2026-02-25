import Course from "../model/courseModel.js";
import User from "../model/userModel.js";


// function to add course to the wishlist:
export const addToWishlist = async(req,res)=>{
  try {
    const {id} = req.body;

    const course = await Course.findById(id);

    if(!course){
      return res.status(400).json("Course not found.")
    }

    const user = await User.findByIdAndUpdate(req.userId,{$push:{wishlist:course._id}},{new:true})

    return res.status(201).json({message:"Added to the wishlist.",Data:user})
  } catch (error) {
    console.log("addtoWishlist error: ",error)
    return res.status(500).json({error:error.message})
  }
}

// fucntion to remove the course from wishlist:
export const removeFromWishlist = async(req,res)=>{
try {
    const {id} = req.body;

    const course = await Course.findById(id);

    if(!course){
      return res.status(400).json("Course not found.")
    }

    const user = await User.findByIdAndUpdate(req.userId,{$pull:{wishlist:course._id}},{new:true})

    return res.status(201).json({message:"removed from the wishlist.",Data:user})

    
} catch (error) {
    console.log("removeFromWishlist error: ",error)
    return res.status(500).json({error:error.message})
}
}

// function to user's all wishlist courses:
export const usersWishlist = async(req,res)=>{
    try {
        const user = await User.findById(req.userId).populate({
          path:"wishlist",
          populate:{
            path:"educator",
            select:"username email photoURL"
          }
        })
  
        if(!user){
            return res.status(400).json("User not Autheticated.")
        }
        return res.status(200).json(user.wishlist)

    } catch (error) {
         console.log("addtoWishlist error: ",error)
    return res.status(500).json({error:error.message})
    }
} 