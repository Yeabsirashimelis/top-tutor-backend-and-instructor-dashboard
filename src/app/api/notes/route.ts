import connectDB from "@/lib/db";
import Note from "@/models/noteModel";
import { NextRequest, NextResponse } from "next/server";

const headers = {
  "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers,
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const sectionId = searchParams.get("sectionId");
    const lectureId = searchParams.get("lectureId");
    const userId = searchParams.get("userId");

    if (!courseId || !sectionId) {
      return NextResponse.json(
        { error: "Missing courseId or sectionId" },
        { status: 400, headers }
      );
    }

    await connectDB();

    const query: any = { courseId, sectionId, userId };
    if (lectureId) {
      query.lectureId = lectureId;
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      { message: "notes fetched successfully", data: notes },
      { status: 200, headers }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      {
        status: 500,
        headers,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, courseId, sectionId, lectureId, content } =
      await req.json();

    if (!userId || !courseId || !sectionId || !lectureId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers }
      );
    }

    await connectDB();

    const newNote = await Note.create({
      userId,
      courseId,
      lectureId,
      sectionId,
      content,
    });

    return NextResponse.json(
      { message: "note posted successfully", notes: newNote },
      { status: 201, headers }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500, headers }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { noteId, content } = await req.json();
    if (!noteId || !content) {
      return NextResponse.json(
        { error: "Missing noteId or content" },
        { status: 400, headers }
      );
    }

    await connectDB();
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { content },
      { new: true }
    );

    if (!updatedNote) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404, headers }
      );
    }

    return NextResponse.json(
      { message: "note updated successfully", note: updatedNote },
      { status: 200, headers }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500, headers }
    );
  }
}

// DELETE note
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const noteId = searchParams.get("noteId");

    if (!noteId) {
      return NextResponse.json(
        { error: "Missing noteId" },
        { status: 400, headers }
      );
    }

    await connectDB();
    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404, headers }
      );
    }

    return NextResponse.json(
      { message: "note deleted successfully", note: deletedNote },
      { status: 200, headers }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500, headers }
    );
  }
}
