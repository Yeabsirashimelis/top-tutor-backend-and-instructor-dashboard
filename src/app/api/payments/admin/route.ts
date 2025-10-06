import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Payment from "@/models/paymentModel";

export async function GET() {
  try {
    await connectDB();
    const payments = await Payment.find({ status: "pending" })
      .populate("user", "name email")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    return NextResponse.json({ payments });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { paymentId, action } = await req.json();

    if (!paymentId || !["approved", "rejected"].includes(action)) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status: action },
      { new: true }
    );

    if (!payment) {
      return NextResponse.json({ message: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
