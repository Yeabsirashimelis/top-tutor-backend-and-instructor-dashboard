import { NextResponse } from "next/server";
import Course from "@/models/courseModel";
import Section from "@/models/sectionModel";
import Lecture from "@/models/lectureModel";

type GetParams = Promise<{ courseId: string }>;

// GET /api/courses/[id]/contents
export const GET = async function (
  request: Request,
  { params }: { params: GetParams }
) {
  try {
    const User = (await import("@/models/userModel")).default;

    const { courseId: id } = await params;

    // 1 Fetch the course and instructor
    const course = await Course.findById(id).populate("instructor");

    if (!course) {
      throw new Error("Course not found.");
    }

    // 2 Fetch sections for this course, ordered by `order`
    const sections = await Section.find({ course: id })
      .sort({ order: 1 })
      .lean(); // lean gives plain JS objects instead of Mongoose documents

    // 3 Fetch lectures for each section
    const sectionsWithLectures = await Promise.all(
      sections.map(async (section) => {
        const lectures = await Lecture.find({ section: section._id })
          .sort({ order: 1 })
          .lean();

        return {
          ...section,
          lectures,
        };
      })
    );

    // 4️4 Return structured response
    return NextResponse.json(
      {
        message: "Course contents fetched successfully",
        course: {
          ...course.toObject(),
          sections: sectionsWithLectures,
        },
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Couldn't get course contents." },
      { status: 500 }
    );
  }
};
