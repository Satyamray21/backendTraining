import mongoose  from "mongoose";
import { DB_NAME } from "../constant.js";
const connectDB = async ()=>{
    try{
      const conncetionInstance=  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
      console.log(`Db is connected !! DB Host ${conncetionInstance.connection.host}`);

    }
    catch (error)
    {
        console.error("Conncetion failed",error.message);
        process.exit(1);
    }
}
export default connectDB