import connectDB from "@/lib/db";
import UserCourseProgress from "@/models/userProgressModel";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; quizId: string } }
) {
  await connectDB();
  const { userId, score, passed } = await req.json();

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

    let quizProgress = progress.quizzesProgress.find(
      (qp: any) => qp.quiz.toString() === params.quizId
    );

    if (!quizProgress) {
      quizProgress = { quiz: params.quizId, attempts: [] };
      progress.quizzesProgress.push(quizProgress);
    }

    quizProgress.attempts.push({
      score,
      passed,
      completedAt: new Date(),
    });

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
