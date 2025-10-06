// app/api/payments/[id]/status/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Payment from "@/models/paymentModel";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const { status } = await req.json();

    if (!status || !["approved", "declined"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status. Must be 'approved' or 'declined'." },
        { status: 400 }
      );
    }

    const payment = await Payment.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!payment) {
      return NextResponse.json({ message: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json({ payment }, { status: 200 });
  } catch (error) {
    console.error("Update payment status error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
