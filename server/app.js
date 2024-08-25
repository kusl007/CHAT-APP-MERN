import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

import cookieParser from "cookie-parser";


const port = 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});



io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  socket.on("message", ({ room, message }) => {
    console.log({ room, message });
    
    


    socket.to(room).emit("receive-message", message);
    // io.to(room).emit("receive-message", message); // both behaves same
  });

  socket.emit("welcome","welcome to the server ")

  socket.broadcast.emit("welcome",`${socket.id} has joined the server`)

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`${socket.id} joined room ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
