import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Course from "@/models/courseModel";
import Section from "@/models/sectionModel";
import Lecture from "@/models/lectureModel";
import Quiz from "@/models/quizModel";

// POST /api/instructor/courses/clone - Clone a course
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { courseId, instructorId, newTitle } = await req.json();

    if (!courseId || !instructorId) {
      return NextResponse.json(
        { message: "Course ID and Instructor ID are required" },
        { status: 400 }
      );
    }

    // Get original course
    const originalCourse = await Course.findOne({
      _id: courseId,
      instructor: instructorId,
    });

    if (!originalCourse) {
      return NextResponse.json(
        { message: "Course not found or unauthorized" },
        { status: 404 }
      );
    }

    // Clone course
    const courseData = originalCourse.toObject();
    delete courseData._id;
    delete courseData.createdAt;
    delete courseData.updatedAt;
    delete courseData.__v;

    const newCourse = await Course.create({
      ...courseData,
      title: newTitle || `${originalCourse.title} (Copy)`,
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });

    // Get and clone sections
    const originalSections = await Section.find({
      course: courseId,
    }).sort({ order: 1 });

    const sectionMapping: { [key: string]: string } = {};

    for (const originalSection of originalSections) {
      const sectionData = originalSection.toObject();
      delete sectionData._id;
      delete sectionData.createdAt;
      delete sectionData.updatedAt;
      delete sectionData.__v;

      const newSection = await Section.create({
        ...sectionData,
        course: newCourse._id,
      });

      sectionMapping[originalSection._id.toString()] = newSection._id.toString();

      // Clone lectures in this section
      const originalLectures = await Lecture.find({
        section: originalSection._id,
      }).sort({ order: 1 });

      for (const originalLecture of originalLectures) {
        const lectureData = originalLecture.toObject();
        delete lectureData._id;
        delete lectureData.createdAt;
        delete lectureData.updatedAt;
        delete lectureData.__v;

        await Lecture.create({
          ...lectureData,
          section: newSection._id,
        });
      }

      // Clone quizzes in this section
      const originalQuizzes = await Quiz.find({
        section: originalSection._id,
      }).sort({ order: 1 });

      for (const originalQuiz of originalQuizzes) {
        const quizData = originalQuiz.toObject();
        delete quizData._id;
        delete quizData.createdAt;
        delete quizData.updatedAt;
        delete quizData.__v;

        await Quiz.create({
          ...quizData,
          section: newSection._id,
          course: newCourse._id,
        });
      }
    }

    // Update course with sections
    const newSections = await Section.find({ course: newCourse._id });
    newCourse.sections = newSections.map((s) => s._id);
    await newCourse.save();

    return NextResponse.json(
      {
        message: "Course cloned successfully",
        course: newCourse,
      },
      {
        status: 201,
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error cloning course:", error);
    return NextResponse.json(
      { message: "Failed to clone course" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
  });
}
