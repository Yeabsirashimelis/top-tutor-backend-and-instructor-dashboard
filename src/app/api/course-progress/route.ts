import connectDB from "@/lib/db";
import UserCourseProgress from "@/models/userProgressModel";
import { NextResponse } from "next/server";

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
