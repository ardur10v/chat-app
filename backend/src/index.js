import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import {connectDB} from "./lib/db.js"
import cookieParser from "cookie-parser"
import messageRoutes from "./routes/message.route.js"
import cors from "cors"
import path from "path"

import {app,server} from "./lib/socket.js"
dotenv.config()
 
// const app=express()
const PORT=process.env.PORT
const __dirname=path.resolve();
//extract json data from body
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({exatended:true}));

app.use(cors({
    origin:["http://localhost:5173","https://chatx-zdke.onrender.com"],
    credentials:true
}))
app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

if(process.env.NODE_ENV=="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("/:catchAll",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    })
}

server.listen(PORT,()=>{
    console.log(`Server started on ${PORT}`);
    connectDB();
})

export default app;