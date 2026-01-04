import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { DailyChallenge, UserChallengeProgress } from "@/models/gamificationModel";

// GET /api/courses/[courseId]/challenges?userId={id} - Get challenges for a course (student view)
export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const { courseId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's active challenges for this course
    const challenges = await DailyChallenge.find({
      course: courseId,
      date: { $gte: today },
      isActive: true,
    }).sort({ date: 1 });

    if (challenges.length === 0) {
      return NextResponse.json(
        { challenges: [], userProgress: [] },
        { status: 200 }
      );
    }

    // Get user's progress for these challenges
    const userProgress = await Promise.all(
      challenges.map(async (challenge) => {
        let progress = await UserChallengeProgress.findOne({
          user: userId,
          challenge: challenge._id,
          date: { $gte: today },
        });

        // Initialize progress if doesn't exist
        if (!progress) {
          progress = await UserChallengeProgress.create({
            user: userId,
            challenge: challenge._id,
            date: today,
            challenges: challenge.challenges.map((c: any) => ({
              type: c.type,
              completed: false,
              progress: 0,
              target: c.target,
            })),
          });
        }

        return {
          challengeId: challenge._id,
          date: challenge.date,
          challenges: progress.challenges,
        };
      })
    );

    return NextResponse.json(
      {
        challenges,
        userProgress,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching course challenges:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenges" },
      { status: 500 }
    );
  }
}
