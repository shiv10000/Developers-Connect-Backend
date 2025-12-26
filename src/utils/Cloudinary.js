import {v2 as cloudinary} from 'cloudinary';
import fs from "fs" //Unlinking and linking the file
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadOnCloudinary = async (localFilePath)  => {
    try{
        if(!localFilePath) return null
        //upload the file to cloudinary
        const response =  await cloudinary.uploader.upload(localFilePath,{
        resource_type : "auto"
        })
        // file has been upload 
        console.log("File is upload on cloudinary",response.url)
        return response;
    }
    catch(error){
         console.log(error)
         fs.unlinkSync(localFilePath) //Remove the loaly saved temporary Filed as the uplaod operation got fail
         return null
    }
}
export {uploadOnCloudinary}

