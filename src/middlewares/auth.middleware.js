import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
//verify krro user hai ki nahin
export const verifyJwt =  asyncHandler(async(req,res,next)=>{
   try{
    const token= req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")//mobile k lye
   if(!token)
   {
    new ApiError(401,"Unauthourizied request");
   }
   // agr token hai jwt se puch sahi hai ki nahin.
   const decodedToken =jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
   const user=await User.findById(decodedToken ?._id).select("-password -refreshToken")
   if(!user)
   {
    throw new ApiError(401,"Invalid user");
   }
   req.user=user;
   next()
   }
   catch(error)
   {
    throw new ApiError(401,error?.message || "Invalid acees token")
   }
})