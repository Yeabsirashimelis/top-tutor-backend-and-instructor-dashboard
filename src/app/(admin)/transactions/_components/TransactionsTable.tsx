"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useGetTransactions } from "../_hooks/order-hooks";

const TransactionsTable = () => {
  const { data: transactions } = useGetTransactions(); // Fetch transaction data

  console.log(transactions);

  // Define columns for transactions
  const columns: ColumnDef<any>[] = [
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
      accessorKey: "transactionId",
      header: "transactionId",
      cell: (info) => info.getValue(),
    },

    {
      accessorKey: "senderWallet",
      header: "senderWallet",
      cell: (info) => info.getValue(),
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
      accessorKey: "memo",
      header: "Memo",
      cell: (info) => info.getValue() || "N/A",
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={transactions || []} />
    </>
  );
};

export default TransactionsTable;
