import { z } from "zod";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { quizSchema } from "@/types/types";
import Quiz from "@/models/quizModel";

export const GET = async (request: Request) => {
  try {
    await connectDB();
    const url = new URL(request.url);
    const sectionId = url.searchParams.get("sectionId");

    const filter = sectionId ? { section: sectionId } : {};
    const quizzes = await Quiz.find(filter).sort({ order: 1 });

    return NextResponse.json({
      message: "Quizzes fetched successfully",
      quizzes,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to fetch quizzes",
      },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    await connectDB();
    const data = await request.json();
    const parsedData = quizSchema.parse(data);

    const newQuiz = await Quiz.create({
      title: parsedData.title,
      section: parsedData.sectionId,
      order: parsedData.order,
      questions: parsedData.questions,
    });

    return NextResponse.json({
      message: "Quiz created successfully",
      quiz: newQuiz,
    });
  } catch (error) {
    let message;
    if (error instanceof z.ZodError) {
      message = error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ message }, { status: 400 });
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = "Failed to create quiz";
    }
    return NextResponse.json({ message }, { status: 500 });
  }
};
