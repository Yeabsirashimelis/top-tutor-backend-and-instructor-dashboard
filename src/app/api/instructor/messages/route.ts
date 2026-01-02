import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { QAMessage, DirectMessage } from "@/models/instructorMessageModel";

// GET /api/instructor/messages?instructorId={id}&type={qa|direct|all}
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const instructorId = req.nextUrl.searchParams.get("instructorId");
    const type = req.nextUrl.searchParams.get("type") || "all";
    const courseId = req.nextUrl.searchParams.get("courseId");
    const status = req.nextUrl.searchParams.get("status");

    if (!instructorId) {
      return NextResponse.json(
        { message: "Instructor ID is required" },
        { status: 400 }
      );
    }

    let qaMessages = [];
    let directMessages = [];

    // Fetch Q&A messages
    if (type === "qa" || type === "all") {
      let qaQuery: any = { instructor: instructorId };
      if (courseId) qaQuery.course = courseId;
      if (status) qaQuery.status = status;

      qaMessages = await QAMessage.find(qaQuery)
        .populate("student", "name email")
        .populate("course", "title")
        .populate("lecture", "title")
        .sort({ isPinned: -1, createdAt: -1 })
        .limit(50);
    }

    // Fetch direct messages
    if (type === "direct" || type === "all") {
      let dmQuery: any = { recipient: instructorId };
      if (status === "unread") dmQuery.isRead = false;

      directMessages = await DirectMessage.find(dmQuery)
        .populate("sender", "name email")
        .populate("course", "title")
        .sort({ createdAt: -1 })
        .limit(50);
    }

    // Calculate unread counts
    const unreadQA = await QAMessage.countDocuments({
      instructor: instructorId,
      status: "pending",
    });

    const unreadDM = await DirectMessage.countDocuments({
      recipient: instructorId,
      isRead: false,
    });

    return NextResponse.json(
      {
        qaMessages,
        directMessages,
        unreadCounts: {
          qa: unreadQA,
          direct: unreadDM,
          total: unreadQA + unreadDM,
        },
      },
      {
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST /api/instructor/messages - Send message or answer Q&A
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { type, ...data } = await req.json();

    if (type === "qa-answer") {
      // Answer a Q&A question
      const { messageId, answer } = data;

      const message = await QAMessage.findByIdAndUpdate(
        messageId,
        {
          answer,
          status: "answered",
          answeredAt: new Date(),
        },
        { new: true }
      ).populate("student", "name email");

      // TODO: Send notification to student

      return NextResponse.json(
        {
          message: "Answer posted successfully",
          qaMessage: message,
        },
        {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
      );
    } else if (type === "direct-message") {
      // Send direct message
      const { senderId, recipientId, subject, message, courseId } = data;

      const dm = await DirectMessage.create({
        sender: senderId,
        recipient: recipientId,
        subject,
        message,
        course: courseId || null,
      });

      // TODO: Send email notification

      return NextResponse.json(
        {
          message: "Message sent successfully",
          directMessage: dm,
        },
        {
          status: 201,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    return NextResponse.json(
      { message: "Invalid message type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { message: "Failed to send message" },
      { status: 500 }
    );
  }
}

// PATCH /api/instructor/messages - Update message status
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const { type, messageId, ...updates } = await req.json();

    if (type === "qa") {
      const message = await QAMessage.findByIdAndUpdate(
        messageId,
        updates,
        { new: true }
      );

      return NextResponse.json({ message: "Q&A updated", qaMessage: message });
    } else if (type === "direct") {
      const message = await DirectMessage.findByIdAndUpdate(
        messageId,
        { ...updates, readAt: updates.isRead ? new Date() : null },
        { new: true }
      );

      return NextResponse.json({ message: "Message updated", directMessage: message });
    }

    return NextResponse.json({ message: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { message: "Failed to update message" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
      "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
  });
}
