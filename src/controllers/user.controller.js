import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/Cloudinary.js"

const registerUser = asyncHandler(
   async(req,res) =>{
        //Get the user details from the frontend part 
        //validate it
        //check if the user already already exist
        //Check fro the image also
        //upload them to cloudinary, check if the avatar is uploaded in the cloudinary
        //Create the user object - create entry in DB
        //remove the password and the referesh token filled
        //check for the user creation 
        //Return response
        const{fullname,email,username,password} = req.body
        console.log(fullname)
        if(
            [fullname,email,username,password].some(
                (field) => field?.trim() ===""
            )
        ){
            throw new ApiError(400,"All field are compulsory or required")

        }

        const existedUser =  await User.findOne({
            $or : [{username},{email}]
        })
        console.log(existedUser)


        if(existedUser){
            throw new ApiError(409,"Users with email name already exist")
        }

        const avatarLocalPath =  req.files?.avatar[0]?.path;
         if(!avatarLocalPath){
        throw new ApiError(40,"Avatar file is required")
      }

      const avatar = await uploadOnCloudinary(avatarLocalPath)
      if(!avatar){
        throw new ApiError(400,"Avatar file is required")
      }


      const user = await User.create(
        {
            fullname,
            avatar : avatar.url,
            email ,
            password,
            username : username.toLowerCase() 
            
        }
      )

      
      const createUser = await User.findById(user._id).select(
        "-password -refreshToken"
      )
      if(!createUser){
        throw new ApiError(500,"Something went wrong while registering a user")
      }

        return res.status(201).json(
        new ApiResponse(200,createUser,"User Registered Successfully")
      )
        
    }
)

export {registerUser}
