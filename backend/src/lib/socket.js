import { Server } from "socket.io";
import http from "http";
import express from "express"

const app = express()
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://chatx-zdke.onrender.com"],
    },
    credentials: true
})

export function getReceiverSocketId(userId) {
    return userSocketMap(userId);
}
//to store online users
//{userId:socketId}
const userSocketMap = new Map();

io.on("connection", (socket) => {
    console.log("User connected", socket.id);
    const userId = socket.userId;
    if (!userSocketMap.has(userId)) userSocketMap.set(userId, new Set());
    userSocketMap.get(userId).add(socket.id);

    io.emit("getOnlineUsers", [...userSocketMap.keys()]);
    socket.on("disconnect", () => {
        const sockets = userSocketMap.get(userId);
        if (sockets) {
            sockets.delete(socket.id);
            if (sockets.size === 0) userSocketMap.delete(userId);
        }
        io.emit("getOnineUsers", [...userSocketMap.keys()]);
    });
})
export { io, app, server };