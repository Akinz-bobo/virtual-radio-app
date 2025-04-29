import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { audiobookId, podcastId, position } = await req.json();

    if (!audiobookId && !podcastId) {
      return NextResponse.json(
        { error: "Either audiobookId or podcastId is required" },
        { status: 400 }
      );
    }

    // Check for duplicate bookmark
    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        userId: user.id,
        audiobookId,
        podcastId,
      },
    });

    if (existingBookmark) {
      return NextResponse.json(
        { error: "Bookmark already exists for this resource" },
        { status: 400 }
      );
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: user.id,
        audiobookId,
        podcastId,
        position,
      },
    });

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      { error: "Failed to create bookmark" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);

  const take = 10;
  const skip = (page - 1) * take;

  try {
    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: { userId: user.id },
        skip,
        take,
        include: {
          audiobook: { select: { title: true } },
          podcast: { select: { title: true } },
        },
      }),
      prisma.bookmark.count({ where: { userId: user.id } }),
    ]);

    return NextResponse.json({
      bookmarks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}
