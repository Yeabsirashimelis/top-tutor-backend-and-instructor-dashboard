import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { DailyChallenge } from "@/models/gamificationModel";
import { getSessionUser } from "@/../../utils/getSessionUser";

// PUT /api/instructor/courses/[courseId]/challenges/[challengeId] - Update challenge
export async function PUT(
  req: NextRequest,
  { params }: { params: { courseId: string; challengeId: string } }
) {
  try {
    await connectDB();
    const sessionData = await getSessionUser();

    if (!sessionData || !sessionData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { challengeId } = params;
    const body = await req.json();
    const { challenges, isActive } = body;

    // Find and update challenge
    const challenge = await DailyChallenge.findOne({
      _id: challengeId,
      instructor: sessionData.userId,
    });

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update fields
    if (challenges) challenge.challenges = challenges;
    if (typeof isActive !== "undefined") challenge.isActive = isActive;

    await challenge.save();

    return NextResponse.json(
      {
        message: "Challenge updated successfully",
        challenge,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating challenge:", error);
    return NextResponse.json(
      { error: "Failed to update challenge" },
      { status: 500 }
    );
  }
}

// DELETE /api/instructor/courses/[courseId]/challenges/[challengeId] - Delete challenge
export async function DELETE(
  req: NextRequest,
  { params }: { params: { courseId: string; challengeId: string } }
) {
  try {
    await connectDB();
    const sessionData = await getSessionUser();

    if (!sessionData || !sessionData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { challengeId } = params;

    // Find and delete challenge
    const challenge = await DailyChallenge.findOneAndDelete({
      _id: challengeId,
      instructor: sessionData.userId,
    });

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Challenge deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting challenge:", error);
    return NextResponse.json(
      { error: "Failed to delete challenge" },
      { status: 500 }
    );
  }
}
