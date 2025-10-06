import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Quiz from "@/models/quizModel";

type GetParams = Promise<{sectionId: string}>
export async function GET(
  req: Request,
  { params }: { params: GetParams }
) {
  await connectDB();
  const {sectionId} = await params
  try {
    const quizzes = await Quiz.find({ section: sectionId }).sort({ order: 1 });
    return NextResponse.json(
      { quizzes },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
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
