import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiRespone } from "../utils/ApiRespone.js";

const generateAccessTokenAndRefreshToken = async(userId)=>
{
  try{
    const user = await User.findById(userId);
   const accessToken= user.generateAccessToken()
   const refreshToken= user.generateRefreshToken()
   user.refreshToken=refreshToken;
  await user.save({ validateBeforeSave:false})//password nah dena ho isliye
  return {accessToken,refreshToken}
  }
  catch{
    throw new ApiError(500,"Something went wrong while generating AccessToken and Refresh Token")
  }
}
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  // Validation
  if ([fullName, username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }] 
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists. Please provide a unique username and email.");
  }

  // File handling
  const avatarLocalPath = req.files?.avatar[0]?.path;

  const coverLocalPath = req.files?.coverImage[0]?.path;
  if( !avatarLocalPath)
  {
    throw new ApiError(400,"avatar is required");
  }
   const avatar=await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverLocalPath);
   if(!avatar)
   {
    throw new ApiError(400,"avatar not uploaded");
   }
   const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase(),
   })
   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" 
   )//for removing use select
   if(!createdUser)
   {
    throw new ApiError(402,"Error occured during registation");
   }
   return res.status(201).json(
    new  ApiRespone(200,createdUser,"Registration successfully")
   )
});

const loginUser = asyncHandler(async (req,res)=>{
  const {email,password,username}=req.body
  if(!(username || email))
  {
    throw new ApiError(400,"Username or password is required");
  }
  const user=await User.findOne(
   {
    $or:[{ username },{email}]
   }
  )
  if(!user)
  {
    throw new ApiError(404,"User not found");
  }
  const isValidPassword=await user.isPasswordCorrect(password)
  if(!isValidPassword)
  {
    throw new ApiError(401,"Invalid User credentials");
  }
  const{accessToken,refreshToken}= await generateAccessTokenAndRefreshToken(user._id)
  const loggedInUser =User.findById(user._id).select("-password -refreshToken")
  const options = {
    httpOnly:true,
    secure:true
  }
  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiRespone(
      200,{
        user:loggedInUser,accessToken,refreshToken
      },
      "User logged In Sucessfully"
    )
  )
})
const loggedOut = asyncHandler(async(req,res)=>{
  //sabse phele cookies ko clear krro ya refresh token ko reset krro
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:undefined
      }
      },
      {
        new:true
      }
    
  )
  const options = {
    httpOnly:true,
    secure:true
  }
  return res
  .status(200)
  .clearcookie("accessToken",option)
  .clearcookie("refreshToken",option)
  .json(new ApiRespone(200,{},"User logged Out"));
})


export { registerUser,loginUser ,loggedOut};
