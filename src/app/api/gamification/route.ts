import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { UserGamification, PointTransaction } from "@/models/gamificationModel";
import { checkAndAwardBadges, checkTimeBasedBadges } from "@/lib/badge-checker";

// GET /api/gamification?userId={id} - Get user's gamification profile
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    let profile = await UserGamification.findOne({ user: userId });

    // Create profile if doesn't exist
    if (!profile) {
      profile = await UserGamification.create({
        user: userId,
        totalPoints: 0,
        level: 1,
        currentLevelPoints: 0,
        pointsToNextLevel: 100,
        totalLecturesCompleted: 0,
        totalQuizzesPassed: 0,
        totalCoursesCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
      });
    }

    // Get recent transactions
    const recentTransactions = await PointTransaction.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json(
      {
        profile,
        recentTransactions,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching gamification profile:", error);
    return NextResponse.json(
      { message: "Failed to fetch gamification profile" },
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

// POST /api/gamification/award-points - Award points to user
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userId, points, type, description, metadata } = await req.json();

    if (!userId || !points || !type) {
      return NextResponse.json(
        { message: "Missing required fields" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Get or create profile
    let profile = await UserGamification.findOne({ user: userId });
    if (!profile) {
      profile = await UserGamification.create({
        user: userId,
        totalPoints: 0,
        level: 1,
        currentLevelPoints: 0,
        pointsToNextLevel: 100,
        totalLecturesCompleted: 0,
        totalQuizzesPassed: 0,
        totalCoursesCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
      });
    }

    // Add points
    profile.totalPoints += points;
    profile.currentLevelPoints += points;

    // Update activity counters based on type
    if (type === "lecture_completed") {
      profile.totalLecturesCompleted = (profile.totalLecturesCompleted || 0) + 1;
    } else if (type === "quiz_passed" || type === "quiz_perfect") {
      profile.totalQuizzesPassed = (profile.totalQuizzesPassed || 0) + 1;
    } else if (type === "course_completed") {
      profile.totalCoursesCompleted = (profile.totalCoursesCompleted || 0) + 1;
    }

    // Track previous level for badge checking
    const previousLevel = profile.level;

    // Check for level up
    while (profile.currentLevelPoints >= profile.pointsToNextLevel) {
      profile.currentLevelPoints -= profile.pointsToNextLevel;
      profile.level += 1;
      profile.pointsToNextLevel = Math.floor(profile.pointsToNextLevel * 1.5); // Exponential scaling
    }

    await profile.save();

    // Check for badges after saving stats
    let newBadges: any[] = [];
    
    // Check badges based on activity type
    if (type === "lecture_completed") {
      const lectureBadges = await checkAndAwardBadges(userId, "lecture");
      newBadges.push(...lectureBadges);
      
      // Check time-based badges
      const hour = new Date().getHours();
      const timeBadges = await checkTimeBasedBadges(userId, hour);
      newBadges.push(...timeBadges);
    } else if (type === "quiz_passed") {
      const quizBadges = await checkAndAwardBadges(userId, "quiz");
      newBadges.push(...quizBadges);
    } else if (type === "quiz_perfect") {
      const perfectBadges = await checkAndAwardBadges(userId, "quiz_perfect");
      newBadges.push(...perfectBadges);
      const quizBadges = await checkAndAwardBadges(userId, "quiz");
      newBadges.push(...quizBadges);
    } else if (type === "course_completed") {
      const courseBadges = await checkAndAwardBadges(userId, "course");
      newBadges.push(...courseBadges);
    }
    
    // Check for level-based badges if level increased
    if (profile.level > previousLevel) {
      const levelBadges = await checkAndAwardBadges(userId, "level");
      newBadges.push(...levelBadges);
    }

    // Create transaction record
    const transaction = await PointTransaction.create({
      user: userId,
      points,
      type,
      description,
      metadata,
    });

    return NextResponse.json(
      {
        message: "Points awarded successfully",
        profile,
        transaction,
        newBadges, // Return newly earned badges
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
    console.error("Error awarding points:", error);
    return NextResponse.json(
      { message: "Failed to award points" },
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
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
  });
}
