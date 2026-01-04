import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { UserGamification } from "@/models/gamificationModel";
import User from "@/models/userModel";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const timeframe = searchParams.get("timeframe") || "all-time"; // all-time, monthly, weekly
    const courseId = searchParams.get("courseId"); // Optional: filter by course

    // Base query
    let query: any = {};

    // Get leaderboard data
    const leaderboard = await UserGamification.find(query)
      .populate("user", "name email")
      .sort({ totalPoints: -1 })
      .limit(limit)
      .lean();

    // Format the response
    const formattedLeaderboard = leaderboard.map((profile: any, index: number) => ({
      rank: index + 1,
      userId: profile.user._id,
      userName: profile.user.name || "Anonymous",
      userEmail: profile.user.email,
      totalPoints: profile.totalPoints,
      level: profile.level,
      currentStreak: profile.currentStreak,
      longestStreak: profile.longestStreak,
      badges: profile.badges?.length || 0,
      totalLecturesCompleted: profile.totalLecturesCompleted,
      totalQuizzesPassed: profile.totalQuizzesPassed,
      totalCoursesCompleted: profile.totalCoursesCompleted,
    }));

    return NextResponse.json(
      {
        leaderboard: formattedLeaderboard,
        total: formattedLeaderboard.length,
        timeframe,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "http://localhost:3000",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { 
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "http://localhost:3000",
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
      "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "http://localhost:3000",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
