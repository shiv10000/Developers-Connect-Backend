import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/Cloudinary.js"
import { use } from "react";


const generateRefreshAndAccessToken = async(userId)=>{
  try{
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save(
      {validateBeforeSave : false}
    )
    return {accessToken,refreshToken}
  }
  catch(error){
    throw new ApiError(400,"Generate refresh token failed")
  }
  

}



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

const loginUser = asyncHandler(
   async(req,res,next) => {
    //take the login deatils from the frontend
    // take  username and password 
    //check the user exist or not 
    //after that check that whether it the password is correct 
    //after that send the access token and the refresh token to the front part using the httpcookies
    
    const {username,email,password} = req.body
    
    if(!email && !password){
      throw ApiError(400,"username and the password are required")
    }
    
    const user = User.findOne(
      { $or: [ {username},{email} ] }
    )
    if(!user){
      throw ApiError(404,"User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
      throw new ApiError(404,"Password is invalid")
    }

    const {accessToken,refreshToken} = generateRefreshAndAccessToken(user._id)
    
    const logedInUser = user.findById(user._id).select(
      "-password -refreshToken"
    )

    res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          user :logedInUser,accessToken,refreshToken
        },
        "User is loged in"
      )
    )
   }
)

const logoutUser = asyncHandler(
   async(req,res,next) => {
    //Access the token
    //After that remove the token from the database

    const accessToken = req.cookies?.accessToken || Headers

  

  }
)

export {registerUser,loginUser}
