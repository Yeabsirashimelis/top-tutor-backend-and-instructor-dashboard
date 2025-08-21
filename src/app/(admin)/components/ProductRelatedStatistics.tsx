"use client";

import React from "react";
import { Package, Grid, Tag, ArrowUpRight } from "lucide-react";
import { useGetProductRelatedStatistics } from "../_hooks/statistics-hook";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";

// Types
type Category = {
  id: string;
  name: string;
  productCount: number;
  subCategoryCount: number;
};

type Subcategory = {
  id: string;
  name: string;
  _count: {
    products: number;
  };
};

type Product = {
  id: string;
  name: string;
  stock: number;
  price: number;
};

type DashboardData = {
  categoriesStatistics: Category[];
  subcategoriesStatistics: Subcategory[];
  productsStatistics: Product[];
};

const Badge: React.FC<
  React.PropsWithChildren<{ variant?: "default" | "secondary" | "destructive" }>
> = ({ children, variant = "default" }) => {
  const colors = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[variant]}`}
    >
      {children}
    </span>
  );
};

export default function ProductRelatedStatistics() {
  //   const [hoveredCard, setHoveredCard] = React.useState<string | null>(null);

  const { data, isPending, error } = useGetProductRelatedStatistics();

  const productRelatedStatistics = data as DashboardData | null;

  console.log(data);

  if (isPending) {
    return <p>loading...</p>;
  }

  if (!data || error) {
    return <p>no data found or check your internet conncetion!</p>;
  }

  const totalProducts = productRelatedStatistics?.categoriesStatistics?.reduce(
    (sum, category) => sum + category.productCount,
    0
  );
  const totalSubcategories =
    productRelatedStatistics?.categoriesStatistics?.reduce(
      (sum, category) => sum + category.subCategoryCount,
      0
    );

  return (
    <div className="p-8 bg-gray-50 ">
      <h1 className={cn("scroll-m-20 text-3xl mb-8 font-bold tracking-tight")}>
        Products Related Statistics
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-transform hover:scale-105">
          <CardHeader>
            <div className="flex items-center justify-between space-x-4">
              <CardTitle>Total Products</CardTitle>
              <Package className="h-4 w-4 text-gray-500" />{" "}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-gray-500">Across all categories</p>
          </CardContent>
        </Card>

        <Card className="transition-transform hover:scale-105">
          <CardHeader>
            <div className="flex items-center justify-between space-x-4">
              <CardTitle>Total Subcategories</CardTitle>
              <Grid className="h-4 w-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubcategories}</div>
            <p className="text-xs text-gray-500">Across all categories</p>
          </CardContent>
        </Card>

        <Card className="transition-transform hover:scale-105">
          <CardHeader>
            <div className="flex items-center justify-between space-x-4">
              <CardTitle>Categories</CardTitle>
              <Tag className="h-4 w-4 text-gray-500" />{" "}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productRelatedStatistics?.categoriesStatistics?.length}
            </div>
            <p className="text-xs text-gray-500">Total number of categories</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mt-12 mb-4">Categories Overview</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {productRelatedStatistics?.categoriesStatistics?.map((category) => (
          <Card
            key={category.id}
            className="transition-transform hover:scale-105"
          >
            <CardHeader>
              <CardTitle>{category?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-semibold">
                    {category?.productCount}
                  </p>
                  <p className="text-sm text-gray-500">Products</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold">
                    {category?.subCategoryCount}
                  </p>
                  <p className="text-sm text-gray-500">Subcategories</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mt-12 mb-4">
        Subcategories Overview
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {productRelatedStatistics?.subcategoriesStatistics?.map(
          (subcategory) => (
            <Card
              key={subcategory.id}
              className="relative overflow-hidden transition-transform hover:scale-105"
            >
              <CardHeader>
                <CardTitle>{subcategory?.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {subcategory?._count.products}
                </p>
                <p className="text-sm text-gray-500">Products</p>
              </CardContent>
              <div className="absolute bottom-2 right-2">
                <ArrowUpRight className="h-5 w-5 text-gray-500" />
              </div>
            </Card>
          )
        )}
      </div>

      <h2 className="text-2xl font-semibold mt-12 mb-4">Products Highlight</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {productRelatedStatistics?.productsStatistics?.map((product) => (
          <Card
            key={product.id}
            className="transition-transform hover:scale-105"
          >
            <CardHeader>
              <CardTitle>{product?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Stock</p>
                  <p className="text-2xl font-semibold">{product?.stock}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-2xl font-semibold">${product?.price}</p>
                </div>
              </div>
              <div className="mt-4">
                <Badge
                  variant={
                    product?.stock > 100
                      ? "default"
                      : product?.stock > 20
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {product?.stock > 100
                    ? "In Stock"
                    : product?.stock > 20
                    ? "Limited Stock"
                    : "Low Stock"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
