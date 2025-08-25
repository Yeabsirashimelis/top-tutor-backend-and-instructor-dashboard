import { z } from "zod";

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { LectureSchema } from "@/types/types";
import Section from "@/models/sectionModel";
import { getSessionUser } from "../../../../utils/getSessionUser";
import Lecture from "@/models/lectureModel";

export const GET = async function (request: Request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const sectionId = url.searchParams.get("sectionId");

    let lectures;

    if (sectionId) {
      lectures = await Lecture.find({ section: sectionId })
        .populate("section", "title")
        .sort({ order: 1 });
    } else {
      lectures = await Lecture.find()
        .populate("section", "title")
        .sort({ createdAt: -1 });
    }

    return NextResponse.json(
      { message: "lecture uploaded successfully", lectures },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch lectures" },
      { status: 500 }
    );
  }
};

export const POST = async function (request: Request) {
  try {
    await connectDB();

    const session = await getSessionUser();
    if (!session || !session.userId) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const parsedData = LectureSchema.parse(data);

    const existingSection = await Section.findById(parsedData.section);
    if (!existingSection) {
      throw new Error("Section not found");
    }

    const newLecture = await Lecture.create(parsedData);

    return NextResponse.json({
      message: "Lecture created successfully",
      lecture: newLecture,
    });
  } catch (error) {
    let message;

    if (error instanceof z.ZodError) {
      message = error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ message }, { status: 400 });
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = "Failed to add lecture";
    }

    return NextResponse.json({ message }, { status: 500 });
  }
};
