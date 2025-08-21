import { z } from "zod";

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { SectionSchema } from "@/types/types";

import Section from "@/models/sectionModel";
import { getSessionUser } from "../../../../../../utils/getSessionUser";
// export const GET = async function (request: Request) {
//   try {
//     await connectDB();
//     const session = await getSessionUser();
//     console.log("************************");
//     console.log(session);
//     console.log("************************");

//     // if (!session || !session.userId) {
//     //   return NextResponse.json({ message: "unauthorized" }, { status: 401 });
//     // }

//     const courses = await Course.find({
//       // instructor: session.userId,
//     });

//     return NextResponse.json({
//       message: "Courses fetched successfully",
//       courses,
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       return NextResponse.json({ message: error.message }, { status: 500 });
//     }
//     return NextResponse.json(
//       { message: "Failed to fetch your courses" },
//       { status: 500 }
//     );
//   }
// };

type PostParams = Promise<{ id: string }>;

export const POST = async function (
  request: Request,
  { params }: { params: PostParams }
) {
  try {
    await connectDB();

    const session = await getSessionUser();
    console.log("************************");
    console.log(session);
    console.log("************************");

    if (!session || !session.userId) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const parsedData = SectionSchema.parse(data);

    const newSection = await Section.create({
      ...parsedData,
      course: id,
    });

    return NextResponse.json({
      message: "Section created successfully",
      section: newSection,
    });
  } catch (error) {
    console.log(error);
    let message;

    if (error instanceof z.ZodError) {
      message = error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ message }, { status: 400 });
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = "Failed to add a section for this course";
    }

    return NextResponse.json({ message }, { status: 500 });
  }
};
