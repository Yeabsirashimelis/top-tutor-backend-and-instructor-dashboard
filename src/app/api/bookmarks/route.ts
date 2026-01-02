import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import LectureBookmark from "@/models/lectureBookmarkModel";

// GET /api/bookmarks - Get user's bookmarks for a lecture or course
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.nextUrl.searchParams.get("userId");
    const lectureId = req.nextUrl.searchParams.get("lectureId");
    const courseId = req.nextUrl.searchParams.get("courseId");

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

    const query: any = { user: userId };
    if (lectureId) query.lecture = lectureId;
    if (courseId) query.course = courseId;

    const bookmarks = await LectureBookmark.find(query)
      .populate("lecture", "title")
      .sort({ timestamp: 1 });

    return NextResponse.json(
      { bookmarks },
      {
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { message: "Failed to fetch bookmarks" },
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

// POST /api/bookmarks - Add a bookmark
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userId, lectureId, courseId, timestamp, note } = await req.json();

    if (!userId || !lectureId || !courseId || timestamp === undefined) {
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

    const bookmark = await LectureBookmark.create({
      user: userId,
      lecture: lectureId,
      course: courseId,
      timestamp,
      note: note || "",
    });

    return NextResponse.json(
      { 
        message: "Bookmark added",
        bookmark 
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
    console.error("Error adding bookmark:", error);
    return NextResponse.json(
      { message: "Failed to add bookmark" },
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

// DELETE /api/bookmarks - Remove a bookmark
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { bookmarkId } = await req.json();

    if (!bookmarkId) {
      return NextResponse.json(
        { message: "Bookmark ID is required" },
        { 
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    const result = await LectureBookmark.findByIdAndDelete(bookmarkId);

    if (!result) {
      return NextResponse.json(
        { message: "Bookmark not found" },
        { 
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    return NextResponse.json(
      { message: "Bookmark removed" },
      {
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return NextResponse.json(
      { message: "Failed to remove bookmark" },
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
      "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
  });
}
