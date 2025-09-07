import connectDB from "@/lib/db";
import UserCourseProgress from "@/models/userProgressModel";
import { NextResponse } from "next/server";

type GetParams = Promise<{ courseId: string }>;

export async function GET(req: Request, { params }: { params: GetParams }) {
  await connectDB();

  const url = new URL(req.url);
  const userId = url.searchParams.get("user");

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required" },
      {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  }

  const { courseId } = await params;

  try {
    // Find existing progress
    let progress = await UserCourseProgress.findOne({
      user: userId,
      course: courseId,
    });

    // Auto-create if missing
    if (!progress) {
      progress = await UserCourseProgress.create({
        user: userId,
        course: courseId,
        lecturesProgress: [], // start empty
      });
    }

    return NextResponse.json(progress, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  }
}
