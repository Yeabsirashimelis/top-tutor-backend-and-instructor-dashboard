import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
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

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const userId = searchParams.get("userId");

    if (!courseId || !userId) {
      return NextResponse.json(
        { message: "Missing params" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    const payment = await Payment.findOne({ course: courseId, user: userId })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { payment },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error" },
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
