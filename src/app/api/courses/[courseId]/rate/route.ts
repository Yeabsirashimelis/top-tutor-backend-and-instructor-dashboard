import connectDB from "@/lib/db";
import CourseReview from "@/models/courseReviewModel";
import { NextRequest, NextResponse } from "next/server";

const headers = {
  "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new Response(null, { status: 204, headers });
}

type GetParams = Promise<{ courseId: string }>;
export async function GET(req: NextRequest, { params }: { params: GetParams }) {
  try {
    const { courseId } = await params;
    const searchParams = new URL(req.url).searchParams;
    const userId = searchParams.get("userId");
    if (!courseId || !userId) {
      return NextResponse.json(
        { error: "Missing courseId or userId" },
        { status: 400, headers }
      );
    }

    await connectDB();
    const rating = await CourseReview.findOne({ courseId, userId });
    return NextResponse.json(
      { message: "Rating fetched", data: rating },
      { status: 200, headers }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500, headers }
    );
  }
}

// POST: create/update rating
export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;
    const { userId, rating, reviewText } = await req.json();
    if (!courseId || !userId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers }
      );
    }

    await connectDB();
    // Upsert: update if exists, otherwise create
    const updatedRating = await CourseReview.findOneAndUpdate(
      { courseId, userId },
      { rating, reviewText, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    return NextResponse.json(
      { message: "Rating saved", data: updatedRating },
      { status: 200, headers }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500, headers }
    );
  }
}
