



import { Server } from "socket.io"
import http from "http"
import express from 'express'


const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    },
})


const userSocketMap = {}
const socketUserMap = {}


export function getRecieverSocketId(userId) {
    if (userSocketMap[userId]) {
        const socketIds = Array.from(userSocketMap[userId]);
        return socketIds.length > 0 ? socketIds[0] : null;
    }
    return null;
}


const broadcastOnlineUsers = () => {
    const onlineUsers = Object.keys(userSocketMap);
    io.emit("getOnlineUsers", onlineUsers);
};


io.on("connection", (socket) => {
    console.log("A user connected.....", socket.id)

    const userId = socket.handshake.query.userId

    if (userId) {
        socketUserMap[socket.id] = userId;

        if (!userSocketMap[userId]) {
            userSocketMap[userId] = new Set();
        }

        userSocketMap[userId].add(socket.id);

        broadcastOnlineUsers();
    }

    socket.on("newMessage", (message) => {
        const receiverSocketId = getRecieverSocketId(message.recieverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", message);
        }
    });

    socket.on("requestOnlineUsers", () => {
        broadcastOnlineUsers();
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected.....", socket.id)

        const userId = socketUserMap[socket.id];

        if (userId) {
            if (userSocketMap[userId]) {
                userSocketMap[userId].delete(socket.id);

                if (userSocketMap[userId].size === 0) {
                    delete userSocketMap[userId];
                }
            }

            delete socketUserMap[socket.id];

            broadcastOnlineUsers();
        }
    })
})


export { io, app, server }


