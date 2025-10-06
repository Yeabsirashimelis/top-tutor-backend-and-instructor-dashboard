import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Quiz from "@/models/quizModel";
import UserCourseProgress from "@/models/userProgressModel";

type GetParams = Promise<{ quizId: string }>

export async function GET(req: Request, { params }: { params: GetParams }) {
  await connectDB();
  const { quizId } = await params;
 const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const courseId = url.searchParams.get("courseId"); 


  const headers = {
    "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
    "Content-Type": "application/json",
  };

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404, headers });
    }

    // Fetch user's progress if userId is provided
 let progress: any = null;
if (userId && courseId) {
  const userProgress = await UserCourseProgress.findOne({
    user: userId,
    course: courseId,
  });

  if (userProgress) {
    const quizProg = userProgress.quizzesProgress.find(
      (qp: any) => qp.quiz.toString() === quizId
    );
    if (quizProg) progress = quizProg.attempts;
  }
}
    return NextResponse.json({ quiz, progress }, { status: 200, headers });
  } catch (err: any) {
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
    console.log(err)
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")

    return NextResponse.json({ error: err.message || "Server error" }, { status: 500, headers });
  }
}
