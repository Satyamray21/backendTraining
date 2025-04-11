import express from "express"
import cors from "cors"
import cookiePraser from "cookie-parser"


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
app.use(express.cookiePraser())

export {app}