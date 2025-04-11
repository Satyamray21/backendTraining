import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const UserSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true,"please provide username"],
        lowercase :true,
        trim:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:[true,"please provide email "],
        unique:true
    },
    fullName:{
        type:String,
        requied :[ true,"Please provide your full name"],

    },
    avatar:{
        type:String,
        required:true,
    },
    coverImage:{
        type:String
    },
    password:{
        type:String,
        required:true,
        minLength:6
        
    },
    refreshToken:{
        type:String,
    },
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
       
    ]

},{timestamps:true})

UserSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();
       this.password = bcrypt.hash(this.password,10) //kisko hash krna hai aur no of of rounds .
       next()
}
)

UserSchema.methods.isPasswordCorrect= async function(password)
{
   return await bcrypt.compare(password,this.password);
}
UserSchema.methods.generateAccessToken= function(){
   return jwt.sign(
    {
    _id:this.id,
    email:this.email,
    username:this.username,
    fullName:this.fullName
   } ,
   process.env.ACCESS_TOKEN_SECRET,
   {
    expiresIn:ACCESS_TOKEN_EXPIRY
   }
)
}
UserSchema.methods.generateRefreshToken= function(){
    return jwt.sign(
        {
        _id:this.id,
        
       } ,
       process.env.REFRESH_TOKEN_SECRET,
       {
        expiresIn:REFRESH_TOKEN_EXPIRY
       }
    )
}

export const User = mongoose.model("User",UserSchema);