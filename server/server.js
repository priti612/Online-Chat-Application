import express from "express"
import "dotenv/config";
import cors from "cors"
import http from "http"
import {connectDB} from './lib/db.js'
import userRouter from "./routes/userRouter.js";
import messageRouter from "./routes/messageRoute.js";
import { Server } from "socket.io";

//create express app and http server
const app = express()
const server = http.createServer(app)

//intialize socket.io server
export const io = new Server(server, {
    cors: { origin: "*" }
})

export const userSocketMap = {};

//socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);
    if (userId) userSocketMap[userId] = socket.id;

    //Emit online users to all connected clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
    })
})

//middleware
app.use(express.json({ limit: "4mb" }))
app.use(cors());

app.use("/api/status", (req, res) =>
    res.send("Server is live")
)
app.use("/api/auth", userRouter)
app.use("/api/messages", messageRouter)

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

//connect to MongoDb
await connectDB()

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server is running on PORT: " + PORT));

