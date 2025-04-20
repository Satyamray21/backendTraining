import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiRespone } from "../utils/ApiRespone.js";
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer";
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password ,role} = req.body;

  if ([fullName, username, email, password,role].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists. Please use a unique username/email.");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverLocalPath ? await uploadOnCloudinary(coverLocalPath) : null;

  if (!avatar) {
    throw new ApiError(400, "Avatar upload failed");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
    role
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(402, "Error occurred during registration");
  }

  return res.status(201).json(
    new ApiRespone(200, createdUser, "Registration successful")
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username: username?.toLowerCase() }, { email }]
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isValidPassword = await user.isPasswordCorrect(password);
  if (!isValidPassword) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiRespone(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken
        },
        "User logged in successfully"
      )
    );
});

const loggedOut = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: { refreshToken: undefined }
  }, { new: true });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiRespone(200, {}, "User logged out successfully"));
});
//refreshing token
const refreshAccessToken = asyncHandler(async (req,res)=>{
  //take token
  const incomingToken = req.cookies.refreshToken || req.body.refreshToken
  if(!incomingToken)
  {
    throw new ApiError(401,"Unauthorized token");
  }
  //ek token aur ek secret
  const decodedToken =jwt.verify(incomingToken,process.env.REFRESH_TOKEN_SECRET)
  const user = await User.findById(decodedToken ?._id);
  if(!user)
  {
    throw new ApiError(401,"Invalid user");
  }
  if(incomingToken !== user?.refreshToken)
  {
    throw new ApiError(401,"Refresh token is expired or used");
  }
  const options ={
    httpOnly:true,
    secure:true,
  }
  const{ accessToken,newrefreshToken}=await generateAccessTokenAndRefreshToken(user._id)
  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",newrefreshToken,options)
  .json(
    new ApiRespone(
      200,
      {
        accessToken,refreshToken:newrefreshToken
      },"Access token refreshed"
    )
  )

})
const changePassword = asyncHandler(async (req, res) => {
  console.log("🔐 Incoming request to change password");
  console.log("req.user:", req.user);
  console.log("req.body:", req.body);

  const { oldpassword, newPassword, email, code } = req.body;
  let user;

  // Case 1: Authenticated user using old password
  if (oldpassword) {
    user = await User.findById(req.user?._id);
    console.log("👤 Found user:", user?.email);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isValidPassword = await user.isPasswordCorrect(oldpassword);
    if (!isValidPassword) {
      throw new ApiError(401, "Invalid old password");
    }
  }

  // Case 2: Reset password via email+code (unauthenticated route)
  else if (email && code) {
    user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (
      user.verificationCode !== code ||
      user.verificationCodeExpires < Date.now()
    ) {
      throw new ApiError(400, "Invalid or expired verification code");
    }

    // Clear the code fields after success
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;

    // Save user after clearing the verification code
    await user.save({ validateBeforeSave: false });
  }

  // Neither method provided
  else {
    throw new ApiError(400, "Provide either old password or reset code");
  }

  // Save new password
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  // Send successful response
  return res
    .status(200)
    .json(new ApiRespone (200, {}, "✅ User password successfully changed"));
});


const deleteByEmail = asyncHandler(async (req, res) => {
  const { email } = req.body; // Get the email from the request body
  console.log('Delete request received for email:', req.body.email);
  // Ensure email is provided
  if (!email) {
    throw new ApiError(400, "Email is required to delete the user");
  }

  // Check if user exists and delete the user by email
  const user = await User.findOneAndDelete({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiRespone(200, {}, "User deleted successfully")
  );
});
const findAllUser = asyncHandler(async (req,res)=>{
  if (req.user.role !== "admin") {
    return res.
    status(403)
    .json({
      success: false,
      message: "Access denied: Admins only"
    });
  }
  const users = await User.find().select("-password -refreshToken")
  if(!users || users.length === 0)
  {
    throw new ApiError(404,"No user found in db");
  }
  res
  .status(200)
  .json(
    new ApiRespone(
      200,
      users,"All User sucessfully fetched:"
    )
  )
})

const sentResetCode = asyncHandler(async(req,res)=>{
  try{
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user)
    {
      throw new ApiError(404,"User not found");
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode=code;
    user.verificationCodeExpires= Date.now() + 10 * 60 * 1000;//10min
    await user.save()//user ko save kiya
    const transporter = nodemailer.createTransport({
      service: "gmail", // kon sa use kr rhe h
      auth: {
        user: process.env.gmail,
        pass: process.env.app_pass, 
      },
  
 
  })
  await transporter.sendMail({
    from: process.env.gmail,
    to: user.email,
    subject: "Reset Your Password",
    text: `Your password reset code is: ${code}`,
  });
  res
.status(200)
.json(new ApiRespone(
  200,{},"Verification Code succesfully send"
))
}

  catch(error)
  {
    console.error("Error in sendResetCode:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
})
const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res.status(200).json(new ApiRespone(200, user, "User details fetched"));
});

export { registerUser, loginUser, loggedOut,refreshAccessToken,changePassword, deleteByEmail,findAllUser,sentResetCode,getUserDetails};
