import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import VideoAnalytics from "@/models/videoAnalyticsModel";

// POST /api/video-analytics - Track video analytics
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const data = await req.json();

    const analytics = await VideoAnalytics.create(data);

    return NextResponse.json(
      { 
        message: "Analytics tracked",
        analytics 
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
    console.error("Error tracking analytics:", error);
    return NextResponse.json(
      { message: "Failed to track analytics" },
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

// GET /api/video-analytics - Get analytics (for instructors)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const lectureId = req.nextUrl.searchParams.get("lectureId");
    const courseId = req.nextUrl.searchParams.get("courseId");

    if (!lectureId && !courseId) {
      return NextResponse.json(
        { message: "Lecture ID or Course ID is required" },
        { 
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    const query: any = {};
    if (lectureId) query.lecture = lectureId;
    if (courseId) query.course = courseId;

    const analytics = await VideoAnalytics.find(query).sort({ createdAt: -1 });

    // Calculate aggregates
    const totalViews = analytics.length;
    const avgWatchDuration = analytics.reduce((sum, a) => sum + a.watchDuration, 0) / totalViews || 0;
    const avgCompletion = analytics.reduce((sum, a) => sum + a.completionPercentage, 0) / totalViews || 0;
    const avgBuffering = analytics.reduce((sum, a) => sum + a.bufferingEvents, 0) / totalViews || 0;

    return NextResponse.json(
      { 
        analytics,
        summary: {
          totalViews,
          avgWatchDuration,
          avgCompletion,
          avgBuffering,
        }
      },
      {
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { message: "Failed to fetch analytics" },
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
