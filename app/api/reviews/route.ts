import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { rating, comment, audiobookId, podcastId } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    if (!audiobookId && !podcastId) {
      return NextResponse.json(
        { error: "Either audiobookId or podcastId is required" },
        { status: 400 }
      );
    }

    // Check for duplicate review
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: user.id,
        audiobookId,
        podcastId,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this item" },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId: user.id,
        audiobookId,
        podcastId,
      },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });

    // Update average rating for the resource
    if (audiobookId) {
      const avgRating = await prisma.review.aggregate({
        where: { audiobookId },
        _avg: { rating: true },
      });
      await prisma.audiobook.update({
        where: { id: audiobookId },
        data: { likeCount: avgRating._avg.rating || 0 },
      });
    } else if (podcastId) {
      const avgRating = await prisma.review.aggregate({
        where: { podcastId },
        _avg: { rating: true },
      });
      await prisma.podcast.update({
        where: { id: podcastId },
        data: { likeCount: avgRating._avg.rating || 0 },
      });
    }

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const audiobookId = searchParams.get("audiobookId");
  const podcastId = searchParams.get("podcastId");
  const page = parseInt(searchParams.get("page") || "1", 10);

  const take = 10;
  const skip = (page - 1) * take;

  try {
    const where = {
      audiobookId,
      podcastId,
    };

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: { id: true, username: true },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    return NextResponse.json({
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
