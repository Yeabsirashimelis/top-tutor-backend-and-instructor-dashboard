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

    console.log("📡 [BACKEND] GET challenges for course:", { courseId, userId });

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { 
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
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

    console.log("📦 [BACKEND] Found challenges:", challenges.length);

    if (challenges.length === 0) {
      return NextResponse.json(
        { challenges: [], userProgress: [] },
        { 
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
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
          const progressChallenges = challenge.challenges.map((c: any) => {
            return {
              type: c.type,
              completed: false,
              progress: 0,
              target: c.target,
            };
          });

          progress = new UserChallengeProgress({
            user: userId,
            challenge: challenge._id,
            date: today,
            challenges: progressChallenges,
          });

          await progress.save();
        }

        return {
          challengeId: challenge._id,
          date: challenge.date,
          challenges: progress.challenges,
        };
      })
    );

    console.log("✅ [BACKEND] Returning challenges and progress");

    return NextResponse.json(
      {
        challenges,
        userProgress,
      },
      { 
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("❌ [BACKEND] Error fetching course challenges:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenges", details: error instanceof Error ? error.message : "Unknown error" },
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
