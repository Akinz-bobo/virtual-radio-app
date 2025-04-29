import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse } from "next";

type SocketServer = SocketIOServer & { io?: SocketIOServer };

export const setupSocket = (
  res: NextApiResponse,
  server: NetServer
): SocketIOServer => {
  if ((res.socket as any).server.io) {
    return (res.socket as any).server.io;
  }

  const io = new SocketIOServer(server, {
    path: "/api/socket",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Handle live broadcast events
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Live broadcast events
    socket.on("start-broadcast", (data) => {
      console.log("Broadcast started:", data);
      socket.broadcast.emit("broadcast-started", data);
    });

    socket.on("end-broadcast", (data) => {
      console.log("Broadcast ended:", data);
      socket.broadcast.emit("broadcast-ended", data);
    });

    // Comment system events
    socket.on("new-comment", (data) => {
      console.log("New comment:", data);
      io.emit("update-comments", data); // Broadcast to all clients
    });

    socket.on("like-comment", (data) => {
      console.log("Comment liked:", data);
      io.emit("update-likes", data); // Broadcast to all clients
    });

    // Handle updated comments
    socket.on("update-comment", (data) => {
      console.log("Comment updated:", data);
      io.emit("comment-updated", data); // Broadcast to all clients
    });

    // Handle deleted comments
    socket.on("delete-comment", (data) => {
      console.log("Comment deleted:", data);
      io.emit("comment-deleted", data); // Broadcast to all clients
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  (res.socket as any).server.io = io;
  return io;
};
