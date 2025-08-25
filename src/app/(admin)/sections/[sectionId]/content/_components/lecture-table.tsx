"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table";
import { Button } from "@/components/ui/button";

import { Lecture } from "@/types/types";
import { formatDuration } from "../../../../../../../utils/formatDuration";

interface LectureTableProps {
  lectures: Lecture[];
  isLoading: boolean;
}

export default function LectureTable({ lectures }: LectureTableProps) {
  const [lectureToEdit, setLectureToEdit] = useState<Lecture | null>(null);
  const [lectureToDelete, setLectureToDelete] = useState<Lecture | null>(null);

  const columns: ColumnDef<Lecture>[] = [
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
          onClick={() => {
            if (row.original.videoUrl) {
              window.open(row.original.videoUrl, "_blank");
            } else {
              alert("Video not available");
            }
          }}
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
      accessorKey: "lectureDuration",
      header: "Duration (hrs)",
      cell: ({ getValue }) => formatDuration(getValue<number>() ?? 0),
    },
    {
      accessorKey: "section",
      header: "Section",
      cell: ({ getValue }) =>
        getValue<{ _id: string; title: string }>()?.title ?? "-",
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
            variant="destructive"
            size="sm"
            onClick={() => setLectureToDelete(row.original)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 flex-1">
      <h1 className="text-2xl capitalize font-bold">
        Lectures of this Section
      </h1>
      <div className="overflow-x-auto w-[95%]">
        <DataTable columns={columns} data={lectures} />
        {/* {lectureToDelete && (
          <DeleteLectureDialog
            lectureToDelete={lectureToDelete}
            setLectureToDelete={setLectureToDelete}
          />
        )} */}
        {/* {lectureToEdit && (
          <EditLectureDialog
            lectureToEdit={lectureToEdit}
            setLectureToEdit={setLectureToEdit}
          />
        )} */}
      </div>
    </div>
  );
}
