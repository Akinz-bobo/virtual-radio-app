import { isAuthenticated } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setupSocket } from "@/lib/sockets";
import { NextApiResponse } from "next";

export async function POST(req: Request, res: NextApiResponse) {
  const user = await isAuthenticated();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const commentId = url.pathname.split("/").pop();
    const { isLike } = await req.json();

    if (!commentId || typeof isLike !== "boolean") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Check if the user has already liked/disliked the comment
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: user.id,
          commentId,
        },
      },
    });

    if (existingLike) {
      // Update the existing like/dislike
      const updatedLike = await prisma.commentLike.update({
        where: {
          userId_commentId: {
            userId: user.id,
            commentId,
          },
        },
        data: { isLike },
      });

      // Emit WebSocket event
      const likesCount = await prisma.commentLike.count({
        where: { commentId, isLike: true },
      });

      const io = setupSocket(res, (res as any).socket?.server);
      io.emit("like-comment", { commentId, likes: likesCount });
      return NextResponse.json(updatedLike, { status: 200 });
    } else {
      // Create a new like/dislike
      const newLike = await prisma.commentLike.create({
        data: {
          userId: user.id,
          commentId,
          isLike,
        },
      });

      // Emit WebSocket event
      const likesCount = await prisma.commentLike.count({
        where: { commentId, isLike: true },
      });

      const io = setupSocket(res, (res as any).socket?.server);
      io.emit("like-comment", { commentId, likes: likesCount });

      return NextResponse.json(newLike, { status: 201 });
    }
  } catch (error) {
    console.error("Error liking/disliking comment:", error);
    return NextResponse.json(
      { error: "Failed to like/dislike comment" },
      { status: 500 }
    );
  }
}
