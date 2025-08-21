"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { Section } from "@/types/types"; // make sure Section type is defined
import { useGetSections } from "../_hooks/course-section-hooks";
// import EditSectionDialog from "./EditSectionDialog";
// import DeleteSectionDialog from "./DeleteSectionDialog";

export default function SectionTable() {
  const router = useRouter();
  const { courseId } = useParams();
  const { data: sections, isPending: isLoadingSections } = useGetSections(
    courseId as string
  );

  const [sectionToEdit, setSectionToEdit] = useState<Section | null>(null);
  const [sectionToDelete, setSectionToDelete] = useState<Section | null>(null);

  const columns: ColumnDef<Section>[] = [
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
      cell: ({ row, getValue }) => (
        <div
          className="max-w-xs truncate font-bold text-blue-600 cursor-pointer hover:underline"
          title={getValue<string>()}
          onClick={() => router.push(`/sections/${row.original._id}`)}
        >
          {getValue<string>()}
        </div>
      ),
    },
    {
      accessorKey: "order",
      header: "Order",
    },
    {
      accessorKey: "sectionDuration",
      header: "Duration (mins)",
      cell: ({ getValue }) => getValue<number>() ?? "-",
    },
    {
      accessorKey: "courseTitle",
      header: "Course",
      cell: ({ getValue }) => getValue<string>() ?? "-",
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSectionToEdit(row.original)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setSectionToDelete(row.original)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <DataTable columns={columns} data={sections} />
      {/* {sectionToDelete && (
        <DeleteSectionDialog
          sectionToDelete={sectionToDelete}
          setSectionToDelete={setSectionToDelete}
        />
      )}
      {sectionToEdit && (
        <EditSectionDialog
          sectionToEdit={sectionToEdit}
          setSectionToEdit={setSectionToEdit}
        />
      )} */}
    </div>
  );
}
