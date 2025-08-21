import { NextResponse } from "next/server";
import { getSessionUser } from "../../../../../utils/getSessionUser";
import Course from "@/models/courseModel";
import { courseSchema } from "@/types/types";
import User from "@/models/userModel";

type GetParams = Promise<{ id: string }>;
// GET /api/courses/[id]
export const GET = async function (
  request: Request,
  { params }: { params: GetParams }
) {
  try {
    const { id } = await params;

    const course = await Course.findById(id).populate("instructor");

    if (!course) {
      throw new Error("Course not found.");
    }
    console.log(course);
    return NextResponse.json(
      { message: "Course fetched successfully", course },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Couldn't get Course." },
      { status: 500 }
    );
  }
};

// type PutParams = Promise<{ id: string }>;
// // PUT /api/product-categories/[id] - edit category infos
// export const PUT = async function (
//   request: Request,
//   { params }: { params: PutParams }
// ) {
//   try {
//     const { id } = await params;
//     // If there is no session, return unauthorized status
//     const session = await getSession();
//     if (!session) {
//       return new Response("unauthorized", { status: 401 });
//     }
//     // Check if a category with the same name exists
//     const existingCategory = await db.productCategory.findUnique({
//       where: { id, isDeleted: false },
//     });

//     if (!existingCategory) {
//       throw new Error("Category not found");
//     }

//     const data = await request.json();

//     const updatedCategory = await db.productCategory.update({
//       where: { id },
//       data: {
//         ...(data.name && { name: data.name }),
//         ...(data.description && { description: data.description }),
//         ...(data.coverImage && { coverImage: data.coverImage }),
//         ...(data.coverImageKey && { coverImageKey: data.coverImageKey }),
//       },
//     });

//     return new Response(
//       JSON.stringify({
//         message: "Product category updated successfully",
//         updatedCategory,
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     if (error instanceof Error) {
//       return NextResponse.json({ message: error.message }, { status: 500 });
//     }
//     return NextResponse.json(
//       { message: "Couldn't update product category." },
//       { status: 500 }
//     );
//   }
// };

type DeleteParams = Promise<{ id: string }>;
export const DELETE = async (
  request: Request,
  { params }: { params: DeleteParams }
) => {
  try {
    const session = await getSessionUser();
    console.log("************************");
    console.log(session);
    console.log("************************");

    if (!session || !session.userId) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    const existingCourse = await Course.findById(id);

    if (!existingCourse) {
      throw new Error("Course does not exist");
    }

    await Course.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Course deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Couldn't delete course" },
      { status: 500 }
    );
  }
};
