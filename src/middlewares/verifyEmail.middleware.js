import {User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js";

import { asyncHandler } from "../utils/asyncHandler.js"
const verifyCode = asyncHandler(async(req,res,next)=>{
    try{
        const {email,code}=req.body;
        const user = await User.findOne({email})
        if(!user || user.verificationCode !== code)
        {
            throw new ApiError(400,"user not found or verifiaction code didnt match");
        }
        if(user. verificationCodeExpires < Date.now())
        {
            throw new ApiError(400,"verifiaction code expired");
        }
        req.userToReset = user;
        next();
    }catch(error)
    {
        throw new ApiError(500,"Something went wrong");
    }
})
export default verifyCode;