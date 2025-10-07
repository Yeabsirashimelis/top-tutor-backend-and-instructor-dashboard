import connectDB from "@/lib/db";
import UserCourseProgress from "@/models/userProgressModel";
import { NextResponse } from "next/server";

type PatchParams = Promise<{ courseId: string; lectureId: string }>;

export const PATCH = async function (
  req: Request,
  { params }: { params: PatchParams }
) {
  await connectDB();
  const { userId, lastPosition, isCompleted } = await req.json();

  const { courseId, lectureId } = await params;

  try {
    const progress = await UserCourseProgress.findOne({
      user: userId,
      course: courseId,
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
      (lp: any) => lp.lecture.toString() === lectureId
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
};
