import { isAuthenticated } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setupSocket } from "@/lib/sockets";
import { NextApiResponse } from "next";

export async function PATCH(req: Request, res: NextApiResponse) {
  const user = await isAuthenticated();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const commentId = url.pathname.split("/").pop();
    const { content } = await req.json();

    if (!commentId || !content) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Check if the user owns the comment
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });

    // Emit WebSocket event
    const io = setupSocket(res, (res as any).socket.server);
    io.emit("update-comment", updatedComment);
    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error) {
    console.error("Error editing comment:", error);
    return NextResponse.json(
      { error: "Failed to edit comment" },
      { status: 500 }
    );
  }
}

// Delete a comment
export async function DELETE(req: Request, res: NextApiResponse) {
  const user = await isAuthenticated();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const commentId = url.pathname.split("/").pop();

    if (!commentId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Check if the user owns the comment or is an admin
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || (comment.userId !== user.id && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    // Emit WebSocket event
    const io = setupSocket(res, (res as any).socket.server);
    io.emit("delete-comment", { id: commentId });

    return NextResponse.json(
      { message: "Comment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
