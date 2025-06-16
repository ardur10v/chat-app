import USER from "../models/user.model.js"
import MESSAGE from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId,io } from "../lib/socket.js";

export const getUsersforSidebar=async(req,res)=>{
    try {
        const loggedInUserId=req.user._id
        const filteredUsers=await USER.find({_id:{$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in message controller",error.message);
        res.status(500).json({message:"Internal server error"})
    }
}

export const getMessages=async(req,res)=>{
    try {
        //since we are using :id in router dynamically, 
        //we will use req.params
        const {id:userToChatId}=req.params
        const myId=req.user._id;
        const messages=await MESSAGE.find({
            $or:[
                {senderId: myId,receiverId: userToChatId},
                {senderId: userToChatId, receiverId:myId}
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessage controller",error.message);
        res.status(500).json({message:"Internal server error"})
    }
}

export const sendMessages=async(req,res)=>{
    try {
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id;
        let imageUrl;
        if(image){
            //uploading base64 image to cloudinary
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
        const newMessage=new MESSAGE({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        await newMessage.save()
        const senderSocketId=getReceiverSocketId(senderId);
        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(senderSocketId).emit("newMessage", newMessage);
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller",error.message);
        res.status(500).json({message:"Internal server error"})
    }
}