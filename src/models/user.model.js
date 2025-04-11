import mongoose from "mongoose"
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

export const User = mongoose.model("User",UserSchema);