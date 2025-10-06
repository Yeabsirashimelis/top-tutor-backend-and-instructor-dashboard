import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Course from "@/models/courseModel";

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  try {
     const User = (await import("@/models/userModel")).default;

    await connectDB();
    const courses = await Course.find({}).populate("instructor");

    return new NextResponse(
      JSON.stringify({ message: "courses fetched successfully", courses }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("GET /api/courses/all error:", error);

    return new NextResponse(
      JSON.stringify({ message: "Error fetching courses", error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
