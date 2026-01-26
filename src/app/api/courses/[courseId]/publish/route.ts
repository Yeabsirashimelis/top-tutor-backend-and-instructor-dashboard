import { NextResponse } from "next/server";
import { getSessionUser } from "../../../../../../utils/getSessionUser";
import Course from "@/models/courseModel";
import connectDB from "@/lib/db";

type Params = Promise<{ courseId: string }>;

// PATCH /api/courses/[courseId]/publish - Toggle publish status
export const PATCH = async function (
  request: Request,
  { params }: { params: Params }
) {
  try {
    await connectDB();
    const session = await getSessionUser();

    if (!session || !session.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await params;

    const course = await Course.findById(courseId);

    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    // Verify the instructor owns this course
    if (course.instructor.toString() !== session.userId) {
      return NextResponse.json(
        { message: "You are not authorized to modify this course" },
        { status: 403 }
      );
    }

    // Toggle the publish status
    course.isPublished = !course.isPublished;
    await course.save();

    return NextResponse.json(
      {
        message: course.isPublished
          ? "Course published successfully"
          : "Course unpublished successfully",
        course,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Couldn't update course publish status" },
      { status: 500 }
    );
  }
};
