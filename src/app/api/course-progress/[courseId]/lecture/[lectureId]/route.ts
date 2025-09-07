import connectDB from "@/lib/db";
import UserCourseProgress from "@/models/userProgressModel";
import { NextResponse } from "next/server";

type PatchParams = Promise<{
  courseId: string;
  lectureId: string;
}>;

// Handle the OPTIONS preflight request for CORS
export async function OPTIONS() {
  const headers = {
    "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
    "Access-Control-Allow-Methods": "PATCH, GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  return new NextResponse(null, { status: 200, headers });
}

export async function PATCH(req: Request, { params }: { params: PatchParams }) {
  await connectDB();
  const { userId, lastPosition, isCompleted } = await req.json();

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

  const { courseId, lectureId } = await params;

  try {
    // Find existing progress or create one
    let progress = await UserCourseProgress.findOne({
      user: userId,
      course: courseId,
    });

    if (!progress) {
      progress = await UserCourseProgress.create({
        user: userId,
        course: courseId,
        lecturesProgress: [],
      });
    }

    // Find existing lecture progress
    const lectureProgress = progress.lecturesProgress.find(
      (lp: any) => lp.lecture.toString() === lectureId
    );

    if (lectureProgress) {
      lectureProgress.lastPosition =
        lastPosition ?? lectureProgress.lastPosition;
      lectureProgress.isCompleted = isCompleted ?? lectureProgress.isCompleted;
      if (isCompleted) lectureProgress.completedAt = new Date();
    } else {
      progress.lecturesProgress.push({
        lecture: lectureId,
        lastPosition: lastPosition || 0,
        isCompleted: !!isCompleted,
        completedAt: isCompleted ? new Date() : null,
      });
    }

    await progress.save();

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
