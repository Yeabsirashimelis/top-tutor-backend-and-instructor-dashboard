import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Course from "@/models/courseModel";
import Payment from "@/models/paymentModel";

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



export async function GET() {
  try {
    await connectDB();

    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    return NextResponse.json({ payments }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId, courseId, collectionId, amount, receiptImage } =
      await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID required" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!courseId && !collectionId) {
      return NextResponse.json(
        { message: "Course or Collection is required" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!receiptImage) {
      return NextResponse.json(
        { message: "Receipt screenshot required" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    // find instructor
    let instructor = null;
    if (courseId) {
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
      instructor = course.instructor;
    }

    const payment = await Payment.create({
      user: userId,
      course: courseId || undefined,
      collection: collectionId || undefined,
      amount,
      instructor,
      receiptImage,
      status: "pending",
    });

    return NextResponse.json(
      { success: true, payment },
      {
        status: 201,
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Payment submission error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
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
