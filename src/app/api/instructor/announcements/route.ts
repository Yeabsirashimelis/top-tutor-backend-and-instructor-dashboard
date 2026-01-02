import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Announcement from "@/models/announcementModel";
import Course from "@/models/courseModel";
import Payment from "@/models/paymentModel";
import { StudentEngagement } from "@/models/courseAnalyticsModel";
import UserProgress from "@/models/userProgressModel";

// GET /api/instructor/announcements?instructorId={id}&courseId={id}
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const instructorId = req.nextUrl.searchParams.get("instructorId");
    const courseId = req.nextUrl.searchParams.get("courseId");

    if (!instructorId) {
      return NextResponse.json(
        { message: "Instructor ID is required" },
        { status: 400 }
      );
    }

    let query: any = { instructor: instructorId };
    if (courseId) {
      query.course = courseId;
    }

    const announcements = await Announcement.find(query)
      .populate("course", "title")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { announcements },
      {
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { message: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

// POST /api/instructor/announcements - Create announcement
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const {
      title,
      content,
      courseId,
      instructorId,
      targetAudience,
      customRecipients,
      scheduledFor,
      sendEmail,
      sendInApp,
    } = await req.json();

    if (!title || !content || !courseId || !instructorId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify course belongs to instructor
    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return NextResponse.json(
        { message: "Course not found or unauthorized" },
        { status: 404 }
      );
    }

    // Calculate recipients count based on target audience
    let recipientCount = 0;
    
    if (targetAudience === "custom" && customRecipients?.length > 0) {
      recipientCount = customRecipients.length;
    } else {
      // Get all enrolled students
      const enrolledStudents = await Payment.find({
        course: courseId,
        status: "approved",
      }).countDocuments();

      if (targetAudience === "all") {
        recipientCount = enrolledStudents;
      } else if (targetAudience === "active") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        recipientCount = await UserProgress.distinct("user", {
          course: courseId,
          lastAccessedAt: { $gte: sevenDaysAgo },
        }).then((users) => users.length);
      } else if (targetAudience === "at-risk") {
        recipientCount = await StudentEngagement.countDocuments({
          course: courseId,
          atRisk: true,
        });
      } else if (targetAudience === "completed") {
        recipientCount = await UserProgress.countDocuments({
          course: courseId,
          overallProgress: { $gte: 100 },
        });
      } else if (targetAudience === "new") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        recipientCount = await Payment.countDocuments({
          course: courseId,
          status: "approved",
          createdAt: { $gte: sevenDaysAgo },
        });
      }
    }

    // Determine status
    let status = "draft";
    let publishedAt = null;

    if (scheduledFor) {
      status = new Date(scheduledFor) <= new Date() ? "published" : "scheduled";
      if (status === "published") {
        publishedAt = new Date();
      }
    } else {
      status = "published";
      publishedAt = new Date();
    }

    const announcement = await Announcement.create({
      title,
      content,
      course: courseId,
      instructor: instructorId,
      targetAudience: targetAudience || "all",
      customRecipients: customRecipients || [],
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      publishedAt,
      status,
      sendEmail: sendEmail !== false,
      sendInApp: sendInApp !== false,
      recipients: recipientCount,
    });

    // TODO: Send actual emails and in-app notifications
    // This would integrate with your email service (SendGrid, AWS SES, etc.)

    return NextResponse.json(
      {
        message: "Announcement created successfully",
        announcement,
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
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { message: "Failed to create announcement" },
      { status: 500 }
    );
  }
}

// PATCH /api/instructor/announcements - Update announcement
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const { announcementId, ...updates } = await req.json();

    if (!announcementId) {
      return NextResponse.json(
        { message: "Announcement ID is required" },
        { status: 400 }
      );
    }

    const announcement = await Announcement.findByIdAndUpdate(
      announcementId,
      updates,
      { new: true }
    );

    if (!announcement) {
      return NextResponse.json(
        { message: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Announcement updated successfully",
        announcement,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error updating announcement:", error);
    return NextResponse.json(
      { message: "Failed to update announcement" },
      { status: 500 }
    );
  }
}

// DELETE /api/instructor/announcements
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const announcementId = req.nextUrl.searchParams.get("announcementId");

    if (!announcementId) {
      return NextResponse.json(
        { message: "Announcement ID is required" },
        { status: 400 }
      );
    }

    const announcement = await Announcement.findByIdAndDelete(announcementId);

    if (!announcement) {
      return NextResponse.json(
        { message: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Announcement deleted successfully" },
      {
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json(
      { message: "Failed to delete announcement" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
      "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
  });
}
