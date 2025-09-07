import { NextResponse } from "next/server";
import z from "zod";
import User from "@/models/userModel";
import { getSessionUser } from "../../../../utils/getSessionUser";
import { instructorSchema } from "@/types/types";

// GET /api/instructor
export const GET = async () => {
  try {
    const session = await getSessionUser();

    if (!session || !session.userId) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    console.log(
      "***************************************************************"
    );
    console.log(user);
    console.log(
      "***************************************************************"
    );

    return NextResponse.json({
      message: "Instructor fetched successfully",
      user,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to fetch instructor",
      },
      { status: 500 }
    );
  }
};

// PUT /api/instructor
export const PUT = async (request: Request) => {
  try {
    const session = await getSessionUser();

    if (!session || !session.userId) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const parsedData = instructorSchema.parse(data);

    const updatedUser = await User.findByIdAndUpdate(
      session.userId,
      { $set: parsedData },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Instructor updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ message }, { status: 400 });
    }

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update instructor",
      },
      { status: 500 }
    );
  }
};
