import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express();
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
    
}))
app.use(express.json({
    limit:"16kb"
}))//json se lele k liye
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))//url k liye.
app.use(express.static("public"))//image k liye
app.use(cookieParser());

import userRouter from "./routers/user.route.js"
//route declaration
app.use("/api/v1/users",userRouter)//phela api hota aur dursa kaha route hota hai

export {app}