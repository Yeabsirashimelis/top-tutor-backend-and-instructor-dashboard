import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Certificate from "@/models/certificateModel";
import Course from "@/models/courseModel";
import { UserGamification } from "@/models/gamificationModel";

// GET /api/certificates?userId={id} - Get user's certificates
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.nextUrl.searchParams.get("userId");
    const certificateId = req.nextUrl.searchParams.get("certificateId");
    const verificationCode = req.nextUrl.searchParams.get("verificationCode");

    if (certificateId) {
      const certificate = await Certificate.findById(certificateId)
        .populate("user", "name email")
        .populate("course", "title");
      
      return NextResponse.json({ certificate });
    }

    if (verificationCode) {
      const certificate = await Certificate.findOne({ verificationCode })
        .populate("user", "name email")
        .populate("course", "title");
      
      return NextResponse.json({ certificate });
    }

    if (userId) {
      const certificates = await Certificate.find({ user: userId })
        .populate("course", "title coverImage")
        .sort({ issuedDate: -1 });
      
      return NextResponse.json({ certificates });
    }

    return NextResponse.json(
      { message: "User ID or certificate ID required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { message: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}

// POST /api/certificates - Generate certificate
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userId, courseId, finalScore } = await req.json();

    if (!userId || !courseId) {
      return NextResponse.json(
        { message: "User ID and Course ID are required" },
        { status: 400 }
      );
    }

    // Check if certificate already exists
    const existing = await Certificate.findOne({ user: userId, course: courseId });
    if (existing) {
      return NextResponse.json(
        { message: "Certificate already issued", certificate: existing },
        { status: 200 }
      );
    }

    // Get course details
    const course = await Course.findById(courseId).populate("instructor", "name");
    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    // Generate unique certificate number
    const certificateNumber = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const verificationCode = Math.random().toString(36).substr(2, 12).toUpperCase();

    // Determine grade
    let grade = "Passed";
    if (finalScore >= 90) grade = "A+";
    else if (finalScore >= 80) grade = "A";
    else if (finalScore >= 70) grade = "B";
    else if (finalScore >= 60) grade = "C";

    // Create certificate
    const certificate = await Certificate.create({
      user: userId,
      course: courseId,
      certificateNumber,
      verificationCode,
      completionDate: new Date(),
      finalScore,
      grade,
      instructorName: course.instructor?.name || "Instructor",
      courseDuration: course.sections?.length || 0,
      skillsAcquired: course.learningOutcomes || [],
    });

    // Note: Course completion counter should be updated via gamification API
    // with type="course_completed" when the course is actually completed
    // Don't increment here to avoid double counting

    return NextResponse.json(
      {
        message: "Certificate generated successfully",
        certificate,
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
    console.error("Error generating certificate:", error);
    return NextResponse.json(
      { message: "Failed to generate certificate" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
  });
}
