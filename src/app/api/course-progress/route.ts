import connectDB from "@/lib/db";
import UserCourseProgress from "@/models/userProgressModel";
import { NextRequest, NextResponse } from "next/server";

// GET /api/course-progress?userId={id} - Get all enrolled courses for a user
export const GET = async function (req: NextRequest) {
  await connectDB();
  
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

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

  try {
    // Get all course progress records for this user
    const progressRecords = await UserCourseProgress.find({ user: userId })
      .populate("course", "title thumbnail description")
      .lean();

    // Extract unique enrolled courses
    const enrolledCourses = progressRecords
      .filter((record: any) => record.course) // Filter out null courses
      .map((record: any) => ({
        _id: record.course._id,
        title: record.course.title,
        thumbnail: record.course.thumbnail,
        description: record.course.description,
        progress: record.progress || 0,
      }));

    return NextResponse.json(
      { enrolledCourses },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    console.error("Error fetching enrolled courses:", err);
    return NextResponse.json(
      { error: err.message },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  }
};

export const POST = async function (req: Request) {
  await connectDB();
  const body = await req.json();
  const { user, course } = body;

  try {
    const existing = await UserCourseProgress.findOne({ user, course });
    if (existing) {
      return NextResponse.json(existing, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      });
    }

    const progress = await UserCourseProgress.create({ user, course });
    return NextResponse.json(progress, {
      status: 201,
      headers: {
        "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  }
};
