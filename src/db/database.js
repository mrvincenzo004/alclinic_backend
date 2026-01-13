import mongoose from "mongoose";

export const connectDatabase=()=>{
    mongoose.connect(process.env.MONGODB_CLOUD_URL).then(()=>{
        console.log("connected to database...");
    })
}


