import User from "../model/userModel.js";
import Course from "../model/courseModel.js";
import Notification from "../model/notificationsModel.js";

// function for user  to enroll for free course:
export const freeCourseEnroll = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json("User not authenticated..");
    }
    const course = await Course.findById(id);
    if (!course) {
      return res.status(400).json("course not found.");
    }

    const checkEnrollment = user.enrolledCourses.includes(id);
    if (checkEnrollment) {
      return res.status(400).json("Course already enrolled.");
    }

    // add user to their enrolled courses:
    user.enrolledCourses.push(id);
    await user.save();

    // add enrolledStudent in the courses:
    course.enrolledStudents.push(user._id);
    await course.save();

    // add notification to course educator:
    const educator = await User.findById(course.educator._id)
    if(!educator){
      return res.status(400).json("No educator found.")
    }

    const notification = await Notification.create({
      user:user._id,
      message:`${user.username} has successfully enrolled in your ${course.title} course`,
      type:"enrollment",
      isRead:false
    })

    educator.notifications.push(notification._id)
    
    await educator.save()
    
    return res.status(200).json(user);
  } catch (error) {
    console.log("Free course enroll error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// function to get user's all enrolled courses:
export const userenrolledcourses = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({path:"enrolledCourses",populate:{path:"educator",select:"username"}})

    if(!user){
        return res.status(400).json("User not authorized.")
    }
    return res.status(200).json(user.enrolledCourses);

  } catch (error) {
    console.log("userEnrolled courses error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// function to get all Students of educator from all of it's courses:
export const StudentCount = async(req,res)=>{
  try {
    const user = await User.findById(req.userId)
      if(!user){
        return res.status(400).json("user does not exist")
      }

      const studentCount = await Course.find({
        _id:{$in:user.courseCreated}
      }).select('title enrolledStudents')

      let totalCount = 0

      studentCount.forEach((c)=>{
       totalCount +=  c.enrolledStudents.length
      })

      return res.status(201).json(totalCount)

      
    



  } catch (error) {
    console.log("allStudents error:", error);
    return res.status(500).json({ error: error.message });
  }
}
