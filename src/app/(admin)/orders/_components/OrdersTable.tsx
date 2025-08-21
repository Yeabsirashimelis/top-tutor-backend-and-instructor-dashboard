"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table";
import { Button } from "@/components/ui/button";
import { useGetOrders } from "../_hooks/order-hooks";
import EditOrderDialog from "./EditOrderDialog";
import { Orders } from "@prisma/client";
import { useRouter } from "next/navigation";

const OrdersTable = () => {
  const { data: orders } = useGetOrders(); // Fetch order data
  const [orderToEdit, setOrderToEdit] = useState<Orders | null>(null);

  const router = useRouter();

  // Define columns for orders
  const columns: ColumnDef<Orders>[] = [
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
      accessorKey: "id",
      header: "Order ID",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "userId",
      header: "User ID",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: (info) => `$${info.getValue()}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as string;
        return (
          <span
            className={`rounded px-2 py-1 text-sm ${
              status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : status === "Confirmed"
                ? "bg-green-300 text-green-700"
                : status === "Shipped"
                ? "bg-blue-300 text-blue-800"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: (info) => {
        const value = info.getValue() as Date;
        return new Date(value).toLocaleDateString();
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="mr-3 flex gap-5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOrderToEdit(row.original)}
            >
              Update Status
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                router.push(`/orders/${row.original.id}`);
              }}
            >
              Details
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={orders || []} />

      {orderToEdit && (
        <EditOrderDialog
          orderToEdit={orderToEdit}
          setOrderToEdit={setOrderToEdit}
        />
      )}
    </>
  );
};

export default OrdersTable;
