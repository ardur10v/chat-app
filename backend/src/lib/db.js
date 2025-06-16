import mongoose from "mongoose"

export const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Mongodb connected')
    }
    catch(error){
        console.log('Mongo db connection error')
    }
}