import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

 // Configuration
 cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
 });

const uploadOnCloudinary = async (localFilePath) => {
     try {
         if (!localFilePath) return null
         //  upload on cloudinary
         const uploadResult = await cloudinary.uploader.upload(localFilePath, {
             resource_type: "auto",
         });

         //  console.log("Uploadresult : ", uploadResult.url);
        //  delete image from local memory after uploading them on cloudinary
         fs.unlinkSync(localFilePath);
         return uploadResult;
     } catch (error) {
         fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation failed
         return null;
     }
 }

 
export { uploadOnCloudinary };