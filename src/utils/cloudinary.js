import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

 // Configuration
 cloudinary.config({ 
    cloud_name: process_params.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process_params.env.CLOUDINARY_API_KEY, 
    api_secret: process_params.env.CLOUDINARY_API_SECRET 
 });

const uploadOnCloudinary = async (localFilePath) => {
     try {
         if (!localFilePath) return null
         //  upload on cloudinary
         const uploadResult = await cloudinary.uploader.upload(localFilePath, {
             resource_type: "auto",
         });

         console.log("Uploadresult : ", uploadResult.url);
         return uploadResult;
     } catch (error) {
         fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation failed
         return null;
     }
 }

 
export { uploadOnCloudinary };