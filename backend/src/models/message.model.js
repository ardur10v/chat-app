import mongoose from "mongoose"

const messageSchema=new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'USER'
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"USER"
    },
    text:{
        type:String,
    },
    image:{
        type:String,
    },

},
{timestamps:true}
)

const MESSAGE=mongoose.model("Message",messageSchema);

export default MESSAGE