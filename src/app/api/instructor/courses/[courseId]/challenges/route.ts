import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { DailyChallenge } from "@/models/gamificationModel";
import { getSessionUser } from "../../../../../../../utils/getSessionUser";

// GET /api/instructor/courses/[courseId]/challenges - Get all challenges for a course
export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    await connectDB();
    const sessionData = await getSessionUser();

    if (!sessionData || !sessionData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = params;

    // Get all challenges for this course
    const challenges = await DailyChallenge.find({
      course: courseId,
      instructor: sessionData.userId,
    }).sort({ date: -1 });

    return NextResponse.json({ challenges }, { status: 200 });
  } catch (error) {
    console.error("Error fetching course challenges:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenges" },
      { status: 500 }
    );
  }
}

// POST /api/instructor/courses/[courseId]/challenges - Create new challenge
export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    await connectDB();
    const sessionData = await getSessionUser();

    if (!sessionData || !sessionData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = params;
    const body = await req.json();
    const { date, challenges } = body;

    // Validate input
    if (!date || !challenges || !Array.isArray(challenges)) {
      return NextResponse.json(
        { error: "Invalid input. Date and challenges array required." },
        { status: 400 }
      );
    }

    // Check if challenge already exists for this course and date
    const existingChallenge = await DailyChallenge.findOne({
      course: courseId,
      date: new Date(date),
    });

    if (existingChallenge) {
      return NextResponse.json(
        { error: "Challenge already exists for this date" },
        { status: 400 }
      );
    }

    // Create new challenge
    const newChallenge = await DailyChallenge.create({
      course: courseId,
      instructor: sessionData.userId,
      date: new Date(date),
      isActive: true,
      challenges,
    });

    return NextResponse.json(
      {
        message: "Challenge created successfully",
        challenge: newChallenge,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating challenge:", error);
    return NextResponse.json(
      { error: "Failed to create challenge" },
      { status: 500 }
    );
  }
}
