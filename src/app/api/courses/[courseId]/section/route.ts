import { z } from "zod";

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { SectionSchema } from "@/types/types";
import Section from "@/models/sectionModel";
import { getSessionUser } from "../../../../../../utils/getSessionUser";
import Course from "@/models/courseModel";

type GetParams = Promise<{ courseId: string }>;

export const GET = async function (
  request: Request,
  { params }: { params: GetParams }
) {
  try {
    await connectDB();
    const session = await getSessionUser();
    console.log("************************");
    console.log(session);
    console.log("************************");

    if (!session || !session.userId) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const { courseId } = await params;

    const existingCourse = await Course.findById(courseId);

    if (!existingCourse) {
      throw new Error("Section not found");
    }

    const sections = await Section.find({
      course: courseId,
    })
      .populate("course", "title")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      message: "sections fetched successfully",
      sections,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Failed to fetch sections for this course" },
      { status: 500 }
    );
  }
};

type PostParams = Promise<{ courseId: string }>;

export const POST = async function (
  request: Request,
  { params }: { params: PostParams }
) {
  try {
    await connectDB();

    const session = await getSessionUser();
    console.log("************************");
    console.log(session);
    console.log("************************");

    if (!session || !session.userId) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const { courseId } = await params;
    const data = await request.json();

    const parsedData = SectionSchema.parse(data);

    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      throw new Error("Section not found");
    }

    const newSection = await Section.create({
      ...parsedData,
      course: courseId,
    });

    return NextResponse.json({
      message: "Section created successfully",
      section: newSection,
    });
  } catch (error) {
    console.log(error);
    let message;

    if (error instanceof z.ZodError) {
      message = error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ message }, { status: 400 });
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = "Failed to add a section for this course";
    }

    return NextResponse.json({ message }, { status: 500 });
  }
};
