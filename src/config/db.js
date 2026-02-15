import mongoose from "mongoose";

async function connectMongoDB(){
    if (process.env.NODE_ENV === 'test') {
        return;
    }
    try{
        const conn=await mongoose.connect(process.env.MONGODB_URI)

        console.log("MongoDB is connected.")
    } catch(error){
        console.log("MongoDB connection failed")
        console.log(error.message)
        process.exit(1)
    }
} 

export default connectMongoDB