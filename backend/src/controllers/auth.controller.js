import bcrypt from "bcryptjs"
import USER from '../models/user.model.js'
import {generateToken} from '../lib/utils.js'
import cloudinary from "../lib/cloudinary.js"

export const signup=async(req,res)=>{
    const {name,email,password}=req.body
    console.log("Received body",req.body)
    try {
        if(!email || !name || !password){
            return res.status(400).json({message:"Please fill all the details"})
        }
        //first we will hash passwords
        if(password.length<6){
            return res.status(400).json({message:"Password must be atleast 6 characters"});
        }
        const user=await USER.findOne({email})
        if(user){
            return res.status(400).json({message:"Email already exists, login."})
        }

        //generate salt of length 10
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        const newUser=new USER({
            name,
            email,
            password: hashedPassword
        })
        if(newUser){
            generateToken(newUser._id,res)
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email:newUser.email,
                profilePic: newUser.profilePic,
            });
        }
        else{
            res.status(400).json({message:"Invalid User Data"})
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({message:"Internl Server Error"});
    }
}

export const login=async(req,res)=>{
    const {email,password}=req.body
    try {
        const user=await USER.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid Credentials"})
        }
        const isCorrect=await bcrypt.compare(password,user.password)
        if(!isCorrect){
            return res.status(400).json({message:"Invalid Credentials"})
        }
        generateToken(user._id,res)
        res.status(200).json({
            _id: user._id,
            name:user.name,
            email: user.email,
            profilePic:user.profilePic
        })
    } catch (error) {
        console.log("Error in login controller",error.message);
        res.status(500).json({message:"Internal serer error"});
    }
}

export const logout=(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out Successfully"})
    } catch (error) {
        console.log("Error in logout controller",error.message)
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const updateProfile=async(req,res)=>{
    try {
        const {profilePic}=req.body;
        const userID=req.user._id;
        if(!profilePic){
            return res.status(400).json({message:"Profile photo required"});
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser=await USER.findByIdAndUpdate(
            userID,
            {profilePic:uploadResponse.secure_url},
            {new:true}
        );
    } catch (error) {
        console.log("Error in update profile",error);
        res.status(500).json({message:"Internal server error"});
    }
};

export const checkAuth=(req,res)=>{
    try{
        res.status(200).json(req.user);
    }catch(error){
        console.log("Error in auth controller",error.message);
        res.status(500).json({message:"Internal server error"})
    }
}

