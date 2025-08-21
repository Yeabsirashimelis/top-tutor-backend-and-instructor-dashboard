import { cn } from "@/lib/utils";
import React from "react";
import OrdersTable from "./OrdersTable";

const OrdersContent = () => {
  return (
    <div className="mx-auto space-y-3 w-full overflow-auto">
      <div className="flex flex-row justify-between items-center">
        <div>
          <h1 className={cn("scroll-m-20 text-3xl font-bold tracking-tight")}>
            Orders
          </h1>
          <p className="text-sm text-muted-foreground">Manage Orders here.</p>
        </div>
      </div>
      <OrdersTable />
    </div>
  );
};

export default OrdersContent;
