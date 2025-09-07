import connectDB from "@/lib/db";
import UserCourseProgress from "@/models/userProgressModel";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; lectureId: string } }
) {
  await connectDB();
  const { userId, lastPosition, isCompleted } = await req.json();

  try {
    const progress = await UserCourseProgress.findOne({
      user: userId,
      course: params.courseId,
    });

    if (!progress) {
      return NextResponse.json(
        { error: "Progress not found" },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    const lectureProgress = progress.lecturesProgress.find(
      (lp: any) => lp.lecture.toString() === params.lectureId
    );

    if (lectureProgress) {
      lectureProgress.lastPosition =
        lastPosition ?? lectureProgress.lastPosition;
      lectureProgress.isCompleted = isCompleted ?? lectureProgress.isCompleted;
      if (isCompleted) {
        lectureProgress.completedAt = new Date();
      }
    } else {
      progress.lecturesProgress.push({
        lecture: params.lectureId,
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
