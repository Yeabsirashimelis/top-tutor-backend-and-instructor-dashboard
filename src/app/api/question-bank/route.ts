import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import QuestionBank from "@/models/questionBankModel";

// GET /api/question-bank - Get questions from bank
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const instructorId = req.nextUrl.searchParams.get("instructorId");
    const courseId = req.nextUrl.searchParams.get("courseId");
    const category = req.nextUrl.searchParams.get("category");
    const difficulty = req.nextUrl.searchParams.get("difficulty");
    const tags = req.nextUrl.searchParams.get("tags");

    if (!instructorId) {
      return NextResponse.json(
        { message: "Instructor ID is required" },
        { 
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    const query: any = { instructor: instructorId };
    if (courseId) query.course = courseId;
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (tags) query.tags = { $in: tags.split(",") };

    const questions = await QuestionBank.find(query).sort({ createdAt: -1 });

    // Get unique categories for filtering
    const categories = await QuestionBank.distinct("category", { instructor: instructorId });

    return NextResponse.json(
      { 
        questions,
        categories,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching question bank:", error);
    return NextResponse.json(
      { message: "Failed to fetch questions" },
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

// POST /api/question-bank - Add question to bank
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const data = await req.json();

    const question = await QuestionBank.create(data);

    return NextResponse.json(
      { 
        message: "Question added to bank",
        question 
      },
      {
        status: 201,
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error adding question:", error);
    return NextResponse.json(
      { message: "Failed to add question" },
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

// PUT /api/question-bank - Update question
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const { questionId, ...updates } = await req.json();

    if (!questionId) {
      return NextResponse.json(
        { message: "Question ID is required" },
        { 
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    const question = await QuestionBank.findByIdAndUpdate(
      questionId,
      updates,
      { new: true }
    );

    if (!question) {
      return NextResponse.json(
        { message: "Question not found" },
        { 
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    return NextResponse.json(
      { 
        message: "Question updated",
        question 
      },
      {
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      { message: "Failed to update question" },
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

// DELETE /api/question-bank
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const questionId = req.nextUrl.searchParams.get("questionId");

    if (!questionId) {
      return NextResponse.json(
        { message: "Question ID is required" },
        { 
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    const result = await QuestionBank.findByIdAndDelete(questionId);

    if (!result) {
      return NextResponse.json(
        { message: "Question not found" },
        { 
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    return NextResponse.json(
      { message: "Question deleted" },
      {
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { message: "Failed to delete question" },
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

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
  });
}
