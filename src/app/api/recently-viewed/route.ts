import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import RecentlyViewed from "@/models/recentlyViewedModel";
import Course from "@/models/courseModel";

// GET /api/recently-viewed - Get user's recently viewed courses
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.nextUrl.searchParams.get("userId");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10");

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

    const recentlyViewed = await RecentlyViewed.find({ user: userId })
      .populate("course")
      .sort({ viewedAt: -1 })
      .limit(limit);

    return NextResponse.json(
      { recentlyViewed },
      {
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching recently viewed:", error);
    return NextResponse.json(
      { message: "Failed to fetch recently viewed courses" },
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

// POST /api/recently-viewed - Add/update recently viewed course
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userId, courseId } = await req.json();

    if (!userId || !courseId) {
      return NextResponse.json(
        { message: "User ID and Course ID are required" },
        { 
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { 
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Update or create recently viewed entry
    const recentlyViewed = await RecentlyViewed.findOneAndUpdate(
      { user: userId, course: courseId },
      { viewedAt: new Date() },
      { upsert: true, new: true }
    );

    // Keep only last 50 entries per user
    const allViews = await RecentlyViewed.find({ user: userId })
      .sort({ viewedAt: -1 })
      .skip(50);
    
    if (allViews.length > 0) {
      await RecentlyViewed.deleteMany({
        _id: { $in: allViews.map(v => v._id) }
      });
    }

    return NextResponse.json(
      { 
        message: "Recently viewed updated",
        recentlyViewed 
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
    console.error("Error updating recently viewed:", error);
    return NextResponse.json(
      { message: "Failed to update recently viewed" },
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
