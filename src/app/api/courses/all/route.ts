import connectDB from "@/lib/db";
import Course from "@/models/courseModel";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();

  try {
    const User = (await import("@/models/userModel")).default;

    const courses = await Course.find({}).populate("instructor");
    await connectDB();

    return NextResponse.json(
      { message: "courses fetched successfully", courses },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching courses:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch courses" }), {
      status: 500,
    });
  }
}
