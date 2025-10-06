import { NextResponse } from "next/server";
import Course from "@/models/courseModel";
import Section from "@/models/sectionModel";
import Lecture from "@/models/lectureModel";
import Quiz from "@/models/quizModel"; // import Quiz model

type GetParams = Promise<{ courseId: string }>;

// GET /api/courses/[id]/contents
export const GET = async function (
  request: Request,
  { params }: { params: GetParams }
) {
  try {
    const { courseId: id } = await params;

    // 1. Fetch course and instructor
    const course = await Course.findById(id).populate("instructor");
    if (!course) throw new Error("Course not found.");

    // 2. Fetch sections for this course
    const sections = await Section.find({ course: id }).sort({ order: 1 }).lean();

    // 3. Fetch lectures for each section
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

    // 4. Fetch all quizzes belonging to this course's sections
    const sectionIds = sections.map((s) => s._id);
    const quizzes = await Quiz.find({ section: { $in: sectionIds } })
      .sort({ order: 1 })
      .lean();

    // 5. Return course, sections, lectures, and quizzes
    return NextResponse.json(
      {
        message: "Course contents fetched successfully",
        course: {
          ...course.toObject(),
          sections: sectionsWithLectures,
          quizzes, // include quizzes here
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
