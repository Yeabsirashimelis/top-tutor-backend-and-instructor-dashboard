import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { UserGamification, BadgeDefinition, PointTransaction } from "@/models/gamificationModel";

// GET /api/gamification/badges - Get all badge definitions
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.nextUrl.searchParams.get("userId");

    const badges = await BadgeDefinition.find().sort({ rarity: 1, name: 1 });

    let userBadges = [];
    if (userId) {
      const profile = await UserGamification.findOne({ user: userId });
      userBadges = profile?.badges || [];
    }

    return NextResponse.json(
      {
        badges,
        userBadges,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "http://localhost:3000",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching badges:", error);
    return NextResponse.json(
      { message: "Failed to fetch badges" },
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

// POST /api/gamification/badges - Award badge to user
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userId, badgeId } = await req.json();

    if (!userId || !badgeId) {
      return NextResponse.json(
        { message: "User ID and Badge ID are required" },
        { 
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "http://localhost:3000",
            "Content-Type": "application/json",
          },
        }
      );
    }

    const badge = await BadgeDefinition.findOne({ badgeId });
    if (!badge) {
      return NextResponse.json(
        { message: "Badge not found" },
        { 
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "http://localhost:3000",
            "Content-Type": "application/json",
          },
        }
      );
    }

    let profile = await UserGamification.findOne({ user: userId });
    if (!profile) {
      profile = await UserGamification.create({ user: userId });
    }

    // Check if badge already earned
    const hasBadge = profile.badges.some((b) => b.badgeId === badgeId);
    if (hasBadge) {
      return NextResponse.json(
        { message: "Badge already earned" },
        { 
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "http://localhost:3000",
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Award badge
    profile.badges.push({
      badgeId,
      earnedAt: new Date(),
      progress: 100,
    });

    // Award points if badge has points
    if (badge.points > 0) {
      profile.totalPoints += badge.points;
      profile.currentLevelPoints += badge.points;

      // Check for level up
      while (profile.currentLevelPoints >= profile.pointsToNextLevel) {
        profile.currentLevelPoints -= profile.pointsToNextLevel;
        profile.level += 1;
        profile.pointsToNextLevel = Math.floor(profile.pointsToNextLevel * 1.5);
      }

      await PointTransaction.create({
        user: userId,
        points: badge.points,
        type: "milestone_reached",
        description: `Earned badge: ${badge.name}`,
      });
    }

    await profile.save();

    return NextResponse.json(
      {
        message: "Badge awarded successfully",
        badge,
        profile,
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "http://localhost:3000",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error awarding badge:", error);
    return NextResponse.json(
      { message: "Failed to award badge" },
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
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
