import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { UserGamification, PointTransaction } from "@/models/gamificationModel";

// POST /api/gamification/streak - Update user's learning streak
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    let profile = await UserGamification.findOne({ user: userId });
    
    if (!profile) {
      profile = await UserGamification.create({
        user: userId,
        totalPoints: 0,
        level: 1,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: new Date(),
      });
      
      return NextResponse.json({ profile, streakBroken: false });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastActivity = profile.lastActivityDate
      ? new Date(profile.lastActivityDate)
      : null;
    
    if (lastActivity) {
      lastActivity.setHours(0, 0, 0, 0);
    }

    const diffTime = lastActivity ? today.getTime() - lastActivity.getTime() : 0;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let streakBroken = false;
    let bonusPoints = 0;

    if (diffDays === 0) {
      // Same day, no change
      return NextResponse.json({ profile, streakBroken: false });
    } else if (diffDays === 1) {
      // Consecutive day, increment streak
      profile.currentStreak += 1;
      
      // Award bonus points for milestones
      if (profile.currentStreak % 7 === 0) {
        bonusPoints = 50; // Weekly streak bonus
      } else if (profile.currentStreak % 30 === 0) {
        bonusPoints = 200; // Monthly streak bonus
      } else {
        bonusPoints = 10; // Daily bonus
      }
      
      // Update longest streak
      if (profile.currentStreak > profile.longestStreak) {
        profile.longestStreak = profile.currentStreak;
      }
    } else {
      // Streak broken
      streakBroken = true;
      profile.currentStreak = 1;
    }

    profile.lastActivityDate = new Date();
    await profile.save();

    // Award bonus points if applicable
    if (bonusPoints > 0) {
      profile.totalPoints += bonusPoints;
      profile.currentLevelPoints += bonusPoints;
      
      // Check for level up
      while (profile.currentLevelPoints >= profile.pointsToNextLevel) {
        profile.currentLevelPoints -= profile.pointsToNextLevel;
        profile.level += 1;
        profile.pointsToNextLevel = Math.floor(profile.pointsToNextLevel * 1.5);
      }
      
      await profile.save();

      await PointTransaction.create({
        user: userId,
        points: bonusPoints,
        type: "streak_bonus",
        description: `${profile.currentStreak} day streak bonus!`,
      });
    }

    return NextResponse.json(
      {
        profile,
        streakBroken,
        bonusPoints,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error updating streak:", error);
    return NextResponse.json(
      { message: "Failed to update streak" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
  });
}
