import Notification from "../model/notificationsModel.js";
import User from "../model/userModel.js";

// function to get all educator notifications:
export const getAllNotification = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate({
        path: "notifications",
        options: { sort: { createdAt: -1 } }
      });
    if (!user) {
      return res.status(400).json("user not found");
    }
    await Notification.updateMany(
      { user: req.userId, isRead: false },
      { $set: { isRead: true } },
    );

    return res.status(200).json(user.notifications)

  } catch (error) {
    console.log("Get notifications error: ", error);
    return res.status(500).json({ error: error.message });
  }
};

// function to get  educator's notification count:
export const  notificationCount = async(req,res)=>{
  try {
    const user = await User.findById(req.userId)
    if(!user){
      return res.status(400).json("user not authenticated.")
    }
    const count = await Notification.countDocuments({
      user:user._id,
      isRead:false
    })
    return res.status(200).json({count})
    
  } catch (error) {
    console.log("Notification count error: ", error);
    return res.status(500).json({ error: error.message });
  }
}
