import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import mime from "mime-types";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadOnCloudinary = async (filepath) => {
  try {
    if (!filepath) return null;
    const absolutePath = path.resolve(filepath);

    const mimetype = mime.lookup(absolutePath);
    let resourseType = "auto";

    if (mimetype === "application/pdf") {
      resourseType = "raw";
    }

    const uploadData = await cloudinary.uploader.upload(absolutePath, {
      resource_type: resourseType,
    });

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    return uploadData;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
    return null;
  }
};

export const destroyFromCloudinary = async(public_id,resourseType)=>{
  if(public_id){
    await cloudinary.uploader.destroy(public_id,{resource_type:resourseType})
  }
}

