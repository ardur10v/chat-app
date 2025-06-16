import mongoose from "mongoose"

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength: 6,
    },
    profilePic:{
        type: String,
        default: ""
    }
},
{timestamps:true}
);

const USER = mongoose.model("User",userSchema)
export default USER;