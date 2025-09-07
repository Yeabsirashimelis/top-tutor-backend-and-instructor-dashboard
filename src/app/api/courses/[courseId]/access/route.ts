import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Course from "@/models/courseModel";
import Payment from "@/models/paymentModel";

type GetParams = Promise<{ courseId: string }>;
export async function GET(req: NextRequest, { params }: { params: GetParams }) {
  try {
    await connectDB();

    // Get userId from query params
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { access: false, message: "User ID required" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { courseId } = await params;

    // Ensure course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { access: false, message: "Course not found" },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Check for a verified payment
    const payment = await Payment.findOne({
      user: userId,
      course: courseId,
      status: "approved",
    });

    return NextResponse.json(
      { access: !!payment },
      {
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error checking access:", error);
    return NextResponse.json(
      { access: false, message: "Server error" },
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
