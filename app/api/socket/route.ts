import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "http";
import { setupSocket } from "@/lib/sockets";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket) return res.end();

  const server = (res.socket as any).server as Server;
  const io = setupSocket(res, server);

  io.on("connection", (socket) => {
    console.log("🔌 New socket connected:", socket.id);

    socket.on("admin:start-broadcast", () => {
      socket.join("broadcast-room");
      io.to("broadcast-room").emit("broadcast:started");
    });

    socket.on("webrtc:offer", ({ offer }) => {
      socket.to("broadcast-room").emit("webrtc:offer", { offer });
    });

    socket.on("webrtc:answer", ({ answer }) => {
      socket.to("admin").emit("webrtc:answer", { answer });
    });

    socket.on("webrtc:ice-candidate", ({ candidate }) => {
      socket.to("broadcast-room").emit("webrtc:ice-candidate", { candidate });
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });

  res.end();
}
