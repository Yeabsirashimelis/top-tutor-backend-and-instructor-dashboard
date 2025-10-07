"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table";
import { useGetCourses } from "../_hooks/course-hooks";
import CoursesImagesDialogue from "./CoursesImageDialog";
import { Button } from "@/components/ui/button";
import DeleteCourseDialog from "./DeleteCourseDialog";
import { Course } from "@/types/types";
import { useRouter } from "next/navigation";

const CoursesTable = () => {
  const router = useRouter();
  const { data: courses } = useGetCourses();
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const columns: ColumnDef<Course>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value: any) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row, getValue }) => {
        const courseId = row.original._id;
        return (
          <div
            className="max-w-xs truncate font-bold capitalize text-lg text-blue-600 cursor-pointer hover:underline"
            title={getValue<string>()}
            onClick={() => router.push(`courses/${courseId}`)}
          >
            {getValue<string>()}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ getValue }) => (
        <div className="max-w-sm truncate" title={getValue<string>()}>
          {getValue<string>()}
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price (ETB)",
      cell: ({ getValue }) => `ETB ${getValue<number>().toFixed(2)}`,
    },
    { accessorKey: "courseType", header: "Course Type" },
    { accessorKey: "language", header: "Language" },
    { accessorKey: "skillLevel", header: "Skill Level" },
    { accessorKey: "courseDuration", header: "Duration (hrs)" },
    {
      accessorKey: "learningOutcomes",
      header: "Learning Outcomes",
      cell: ({ getValue }) => {
        const outcomes = getValue<string[]>();
        return outcomes?.length ? (
          <div className="max-w-xs truncate" title={outcomes.join(", ")}>
            {outcomes.join(", ")}
          </div>
        ) : (
          "-"
        );
      },
    },
    {
      accessorKey: "coverImage",
      header: "Image",
      cell: ({ getValue }) => {
        const img = getValue<string>();
        return img ? (
          <CoursesImagesDialogue imageUrl={img} title="Course Image" />
        ) : (
          <>-</>
        );
      },
    },
    {
      accessorKey: "ratingsAverage",
      header: "Avg Rating",
      cell: ({ getValue }) => getValue<number>()?.toFixed(1) ?? "-",
    },
    {
      accessorKey: "ratingsQuantity",
      header: "Ratings",
      cell: ({ getValue }) => getValue<number>() ?? "-",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ getValue }) =>
        getValue<string>()
          ? new Date(getValue<string>()).toLocaleDateString()
          : "-",
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ getValue }) =>
        getValue<string>()
          ? new Date(getValue<string>()).toLocaleDateString()
          : "-",
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="mr-3 flex gap-5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCourseToEdit(row.original)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setCourseToDelete(row.original)}
          >
            Delete
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-green-600"
            onClick={() =>
              router.push(
                `/courses/${
                  row.original._id
                }/content?title=${encodeURIComponent(
                  row.original.title as string | number | boolean
                )}`
              )
            }
          >
            Manage Contents
          </Button>
        </div>
      ),
    },
  ];

  return (
    // Only this container scrolls horizontally
    <div>
      {/* Ensure table has minimum width */}
      <div className="w-screen overflow-x-auto">
        <DataTable columns={columns} data={courses || []} />
      </div>

      {courseToDelete && (
        <DeleteCourseDialog
          courseToDelete={courseToDelete}
          setCourseToDelete={setCourseToDelete}
        />
      )}
      {/* {courseToEdit && (
        <EditCourseDialog
          courseToEdit={courseToEdit}
          setCourseToEdit={setCourseToEdit}
        />
      )} */}
    </div>
  );
};

export default CoursesTable;
