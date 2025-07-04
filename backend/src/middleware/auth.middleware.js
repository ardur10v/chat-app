import jwt from "jsonwebtoken"
import USER from "../models/user.model.js"

export const protectRoute=async(req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        if(!token){
             return res.status(400).json({message:"Unauthorized"});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:"Unaothorized"})
        }
        const user=await USER.findById(decoded.userID).select("-password");
        if(!user){
            res.status(404).json({message:"User not found"});
        }
        req.user=user
        next()
    } catch (error) {
        console.log("Error in protectRoute middleware",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}