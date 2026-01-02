import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Wishlist from "@/models/wishlistModel";
import Course from "@/models/courseModel";

// GET /api/wishlist - Get user's wishlist
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

    const wishlist = await Wishlist.find({ user: userId })
      .populate("course")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { wishlist },
      {
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { message: "Failed to fetch wishlist" },
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

// POST /api/wishlist - Add course to wishlist
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

    // Check if already in wishlist
    const existing = await Wishlist.findOne({ user: userId, course: courseId });
    if (existing) {
      return NextResponse.json(
        { message: "Course already in wishlist" },
        { 
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    const wishlistItem = await Wishlist.create({
      user: userId,
      course: courseId,
    });

    return NextResponse.json(
      { 
        message: "Course added to wishlist",
        wishlistItem 
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
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { message: "Failed to add to wishlist" },
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

// DELETE /api/wishlist - Remove course from wishlist
export async function DELETE(req: NextRequest) {
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

    const result = await Wishlist.findOneAndDelete({
      user: userId,
      course: courseId,
    });

    if (!result) {
      return NextResponse.json(
        { message: "Wishlist item not found" },
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
      { message: "Course removed from wishlist" },
      {
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json(
      { message: "Failed to remove from wishlist" },
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
