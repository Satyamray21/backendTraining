import mongoose  from "mongoose";

const videoSchema = ({
    videoFile: {
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    owner:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
        
    ],
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:String
    }


},{timestamps:true})

export const Video = mongoose.model("Video",videoSchema)