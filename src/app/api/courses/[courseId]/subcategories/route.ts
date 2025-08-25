import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET api/product-categories/[id]/subcategories
type GetParams = Promise<{ id: string }>;

export const GET = async function (
  request: Request,
  { params }: { params: GetParams }
) {
  try {
    const { id } = await params;

    // Fetch subcategories and product count for the given category ID
    const subcategories = await db.productSubCategory.findMany({
      where: {
        categoryId: id,
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        description: true,
        coverImage: true,
        createdAt: true,
        updatedAt: true,
        products: {
          where: {
            isDeleted: false,
          },
          select: {
            id: true,
          },
        },
      },
    });

    // Map the subcategories to include the product count
    const subcategoriesWithProductCount = subcategories.map((subcategory) => ({
      id: subcategory.id,
      name: subcategory.name,
      description: subcategory.description,
      coverImage: subcategory.coverImage,
      createdAt: subcategory.createdAt,
      updatedAt: subcategory.updatedAt,
      productCount: subcategory.products.length,
    }));

    return NextResponse.json(subcategoriesWithProductCount, {
      headers: {
        "Access-Control-Allow-Origin":
          "https://australiamines-client-seven.vercel.app/", // Replace '*' with the specific frontend origin
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Couldn't fetch subcategories." },
      { status: 500 }
    );
  }
};

export const OPTIONS = async function () {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin":
        "https://australiamines-client-seven.vercel.app", // Replace '*' with the specific frontend origin
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
};
