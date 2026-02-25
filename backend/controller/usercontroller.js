import {
  destroyFromCloudinary,
  uploadOnCloudinary,
} from "../config/cloudinary.js";
import User from "../model/userModel.js";
import Course from "../model/courseModel.js";

// function to get the user data or user's profile (if educator):
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json("user does not exist.");
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log("Get current user error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// function to update the user's profile:
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      description,
      username,
      location,
      headline,
      phone,
      teachingPhilosophy,
      experience,
    } = req.body;

    let photoURL;

    let {
      languages,
      skills,
      specializations,
      linkedIn,
      youtube,
      twitter,
      personal,
    } = req.body;

    const updateData = {};

    if (description && description.trim() !== "")
      updateData.description = description;
    if (username && username.trim() !== "") updateData.username = username;
    if (location && location.trim() !== "") updateData.location = location;
    if (headline && headline.trim() !== "") updateData.headline = headline;
    if (experience) updateData.experience = experience;
    if (phone && phone.trim() !== "") updateData.phone = phone;
    if (teachingPhilosophy && teachingPhilosophy.trim() !== "")
      updateData.teachingPhilosophy = teachingPhilosophy;
    if (linkedIn && linkedIn.trim() !== "") updateData.linkedIn = linkedIn;
    if (youtube && youtube.trim() !== "") updateData.youtube = youtube;
    if (description && description.trim() !== "")
      updateData.description = description;
    if (twitter && twitter.trim() !== "") updateData.twitter = twitter;
    if (personal && personal.trim() !== "") updateData.personal = personal;

    if (languages && typeof languages == "string") {
      languages = JSON.parse(languages);
      updateData.languages = languages;
    }
    if (skills && typeof skills == "string") {
      skills = JSON.parse(skills);
      updateData.skills = skills;
    }
    if (specializations && typeof specializations == "string") {
      specializations = JSON.parse(specializations);
      updateData.specializations = specializations;
    }

    if (req.file) {
      photoURL = await uploadOnCloudinary(req.file.path);
      if (photoURL)
        updateData.photoURL = {
          pubic_id: photoURL.public_id,
          url: photoURL.secure_url,
        };
    }
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json("No valid provided to update.");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true },
    );
    if (!user) {
      return res.status(400).json("User not found.");
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log("update profile error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// function to delete the user profile:
export const deleteUser = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json("User not authenticated.");
    }

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json("User does not exist.");
    }

    if (user?.photoURL?.public_id) {
      await destroyFromCloudinary(user.photoURL.public_id,"image");
    }

    // update the array of enrolledStudents in all courses:
    await Course.updateMany(
      { enrolledStudents: userId },
      { $pull: { enrolledStudents: userId } },
    );

    // update the reviews array in courses:
    await Course.updateMany(
      { "reviews.userId": userId },
      { $pull: { reviews: { userId: userId } } },
    );

    await User.deleteOne({_id:userId});

    return res.status(200).json("User deleted.successfully.");
  } catch (error) {
    console.log("Delete profile error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// function to get educator's profile:
export const educatorProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json("User not authenticated.");
    }

    const educator = await User.findById(id);
    if (!educator) {
      return res.status(400).json("no user found.");
    }

    return res.status(200).json(educator);
  } catch (error) {
    console.log("educator's profile error:", error);
    return res.status(500).json({ error: error.message });
  }
};
