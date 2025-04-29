import { isAuthenticated } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NextApiResponse } from "next";
import { setupSocket } from "@/lib/sockets";

// Create a comment
export async function POST(req: Request, res: NextApiResponse) {
  const user = await isAuthenticated();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content, audiobookId, podcastId, liveBroadcastId, parentId } =
      await req.json();

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: user.id,
        audiobookId,
        podcastId,
        liveBroadcastId,
        parentId,
      },
      include: {
        user: {
          select: { id: true, username: true, profileImage: true },
        },
      },
    });
    // Emit WebSocket event
    const io = setupSocket(res, (res as any).socket.server);
    io.emit("new-comment", comment);

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

// Fetch comments
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const audiobookId = searchParams.get("audiobookId");
  const podcastId = searchParams.get("podcastId");
  const liveBroadcastId = searchParams.get("liveBroadcastId");
  const parentId = searchParams.get("parentId");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const sort = searchParams.get("sort") || "newest";

  const take = 10;
  const skip = (page - 1) * take;

  try {
    const where = {
      audiobookId,
      podcastId,
      liveBroadcastId,
      parentId,
    };

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        skip,
        take,
        orderBy: { likes: { _count: "desc" } },
        include: {
          user: {
            select: { id: true, username: true, profileImage: true },
          },
          likes: true,
          replies: true,
        },
      }),
      prisma.comment.count({ where }),
    ]);

    return NextResponse.json({
      comments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
