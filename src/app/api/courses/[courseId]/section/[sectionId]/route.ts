import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Section from "@/models/sectionModel";
import { getSessionUser } from "../../../../../../../utils/getSessionUser";
import { SectionSchema } from "@/types/types";
import z from "zod";

type DeleteParams = Promise<{ courseId: string; sectionId: string }>;

export const DELETE = async (
  request: Request,
  { params }: { params: DeleteParams }
) => {
  try {
    await connectDB();

    const session = await getSessionUser();
    if (!session || !session.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { courseId, sectionId } = await params;
    console.log(courseId);
    console.log(sectionId);

    const deletedSection = await Section.findOneAndDelete({
      _id: sectionId,
      course: courseId,
    });

    if (!deletedSection) {
      throw new Error("Section not found");
    }

    return NextResponse.json({
      message: "Section deleted successfully",
      section: deletedSection,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: (error as Error).message || "Failed to delete section" },
      { status: 500 }
    );
  }
};

interface Params {
  params: {
    courseId: string;
    sectionId: string;
  };
}

type PutParams = Promise<{ courseId: string; sectionId: string }>;

// make all fields optional for update
const SectionUpdateSchema = SectionSchema.partial();

export async function PUT(req: Request, { params }: { params: PutParams }) {
  try {
    await connectDB();
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { courseId, sectionId } = await params;
    const body = await req.json();

    // ✅ Validate with Zod
    const validatedData = SectionUpdateSchema.parse(body);

    // build dynamic update object
    const updateData: Record<string, any> = {};
    if (validatedData.title !== undefined)
      updateData.title = validatedData.title;
    if (validatedData.order !== undefined)
      updateData.order = validatedData.order;
    if (validatedData.sectionDuration !== undefined)
      updateData.sectionDuration = validatedData.sectionDuration;

    const updatedSection = await Section.findOneAndUpdate(
      { _id: sectionId, course: courseId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedSection) {
      return NextResponse.json(
        { message: "Section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSection, { status: 200 });
  } catch (error) {
    let message;

    if (error instanceof z.ZodError) {
      // collect all validation error messages into one string
      message = error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ message }, { status: 400 });
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = "Failed to update section";
    }

    return NextResponse.json({ message }, { status: 500 });
  }
}
