import { z } from "zod";

import { NextResponse } from "next/server";
import { getSessionUser } from "../../../../utils/getSessionUser";
import Course from "@/models/courseModel";
import connectDB from "@/lib/db";
import { courseSchema } from "@/types/types";

export const GET = async function (request: Request) {
  try {
    await connectDB();
    const session = await getSessionUser();
    console.log("************************");
    console.log(session);
    console.log("************************");

    // if (!session || !session.userId) {
    //   return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    // }

    const courses = await Course.find({
      // instructor: session.userId,
    });

    return NextResponse.json({
      message: "Courses fetched successfully",
      courses,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Failed to fetch your courses" },
      { status: 500 }
    );
  }
};

export const POST = async function (request: Request) {
  try {
    await connectDB();

    const session = await getSessionUser();
    console.log("************************");
    console.log(session);
    console.log("************************");

    if (!session || !session.userId) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const parsedData = courseSchema.parse(data);

    const newCourse = await Course.create({
      ...parsedData,
      instructor: session.userId,
    });

    return NextResponse.json({
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    let message;

    if (error instanceof z.ZodError) {
      message = error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ message }, { status: 400 });
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = "Failed to add a course";
    }

    return NextResponse.json({ message }, { status: 500 });
  }
};
