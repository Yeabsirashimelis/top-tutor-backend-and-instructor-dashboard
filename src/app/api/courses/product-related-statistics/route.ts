import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async function (request: Request) {
  try {
    // Fetch category count with only non-deleted subcategories and products
    const eachCategoryWithCount = await db.productCategory.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            products: { where: { isDeleted: false } },
          },
        },
        subCategories: {
          where: { isDeleted: false }, // Filtering only non-deleted subcategories
          select: {
            id: true,
          },
        },
      },
    });

    // Transform data to include subCategories count
    const categoryStats = eachCategoryWithCount.map((category) => ({
      id: category.id,
      name: category.name,
      productCount: category._count.products,
      subCategoryCount: category.subCategories.length, // Corrected count
    }));

    // Fetch subcategory count with only non-deleted products
    const eachSubcategoryWithCount = await db.productSubCategory.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        _count: { select: { products: { where: { isDeleted: false } } } },
      },
    });

    // Fetch product count with only non-deleted products
    const eachProductWithCount = await db.product.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        stock: true,
        price: true,
      },
    });

    const dataToReturn = {
      categoriesStatistics: categoryStats,
      subcategoriesStatistics: eachSubcategoryWithCount,
      productsStatistics: eachProductWithCount,
    };

    return NextResponse.json(dataToReturn, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "Couldn't get product-related statistics",
      },
      { status: 500 }
    );
  }
};
