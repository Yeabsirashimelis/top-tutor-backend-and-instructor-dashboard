import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Course from "@/models/courseModel";
import Payment from "@/models/paymentModel";
import UserProgress from "@/models/userProgressModel";
import User from "@/models/userModel";
import { StudentEngagement } from "@/models/courseAnalyticsModel";

// GET /api/instructor/students?instructorId={id}&courseId={id}&filter={all|active|at-risk|completed}
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const instructorId = req.nextUrl.searchParams.get("instructorId");
    const courseId = req.nextUrl.searchParams.get("courseId");
    const filter = req.nextUrl.searchParams.get("filter") || "all";
    const search = req.nextUrl.searchParams.get("search") || "";

    if (!instructorId) {
      return NextResponse.json(
        { message: "Instructor ID is required" },
        { status: 400 }
      );
    }

    // Get instructor's courses
    let query: any = { instructor: instructorId };
    if (courseId) {
      query._id = courseId;
    }
    
    const courses = await Course.find(query).select("_id title");
    const courseIds = courses.map((c) => c._id);

    // Get all enrolled students (approved payments)
    const enrollments = await Payment.find({
      course: { $in: courseIds },
      status: "approved",
    })
      .populate("user", "name email")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    // Get progress for all students
    const studentIds = enrollments.map((e) => e.user);
    const progressData = await UserProgress.find({
      user: { $in: studentIds },
      course: { $in: courseIds },
    });

    // Get engagement data
    const engagementData = await StudentEngagement.find({
      student: { $in: studentIds },
      course: { $in: courseIds },
    });

    // Build student list with metrics
    const students = enrollments.map((enrollment: any) => {
      const userId = enrollment.user._id;
      const courseIdStr = enrollment.course._id;

      const progress = progressData.find(
        (p) =>
          p.user.toString() === userId.toString() &&
          p.course.toString() === courseIdStr.toString()
      );

      const engagement = engagementData.find(
        (e) =>
          e.student.toString() === userId.toString() &&
          e.course.toString() === courseIdStr.toString()
      );

      const lastActive = progress?.lastAccessedAt || enrollment.createdAt;
      const now = new Date();
      const daysSinceActive = Math.floor(
        (now.getTime() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        studentId: userId,
        name: enrollment.user.name,
        email: enrollment.user.email,
        courseId: courseIdStr,
        courseTitle: enrollment.course.title,
        enrolledAt: enrollment.createdAt,
        lastActive,
        daysSinceActive,
        progress: progress?.overallProgress || 0,
        engagementScore: engagement?.engagementScore || 0,
        atRisk: engagement?.atRisk || daysSinceActive > 14,
        completed: (progress?.overallProgress || 0) >= 100,
        lecturesCompleted:
          progress?.completedLectures?.length || 0,
        quizzesPassed: engagement?.quizzesPassed || 0,
      };
    });

    // Apply filters
    let filteredStudents = students;

    if (filter === "active") {
      filteredStudents = students.filter((s) => s.daysSinceActive <= 7);
    } else if (filter === "at-risk") {
      filteredStudents = students.filter((s) => s.atRisk);
    } else if (filter === "completed") {
      filteredStudents = students.filter((s) => s.completed);
    }

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      filteredStudents = filteredStudents.filter(
        (s) =>
          s.name.toLowerCase().includes(searchLower) ||
          s.email.toLowerCase().includes(searchLower) ||
          s.courseTitle.toLowerCase().includes(searchLower)
      );
    }

    // Calculate summary stats
    const summary = {
      total: students.length,
      active: students.filter((s) => s.daysSinceActive <= 7).length,
      atRisk: students.filter((s) => s.atRisk).length,
      completed: students.filter((s) => s.completed).length,
    };

    return NextResponse.json(
      {
        students: filteredStudents,
        summary,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { message: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
  });
}
