import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Quiz from "@/models/quizModel";
import UserCourseProgress from "@/models/userProgressModel";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

type PostParams = Promise<{ courseId: string,quizId: string }>

export async function POST(req: Request, { params }: { params: PostParams }) {
  await connectDB();

  const headers = {
    "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
    "Content-Type": "application/json",
  };

  try {
    const { courseId, quizId } = await params;
    const { userId, score, passed } = await req.json();

    // validate
    if (!userId || score == null || passed == null) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers });
    }

    const quizExists = await Quiz.findById(quizId);
    if (!quizExists) return new Response(JSON.stringify({ error: "Quiz not found" }), { status: 404, headers });

    // upsert user attempt
    let progress = await UserCourseProgress.findOne({ user: userId, course: courseId });

    if (!progress) {
      progress = await UserCourseProgress.create({
        user: userId,
        course: courseId,
        quizzesProgress: [{ quiz: quizId, attempts: [{ score, passed, completedAt: new Date() }] }],
      });
    } else {
      let quizProg = progress.quizzesProgress.find((qp: any) => qp.quiz.toString() === quizId);
      if (!quizProg) {
        progress.quizzesProgress.push({ quiz: quizId, attempts: [{ score, passed, completedAt: new Date() }] });
      } else {
        quizProg.attempts.push({ score, passed, completedAt: new Date() });
      }
      await progress.save();
    }

    return new Response(JSON.stringify({ message: "Quiz attempt recorded" }), { status: 200, headers });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Server error" }), { status: 500, headers });
  }
}
