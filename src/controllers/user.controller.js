import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiRespone } from "../utils/ApiRespone.js";
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

export { registerUser };
