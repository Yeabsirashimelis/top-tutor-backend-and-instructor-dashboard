import { cn } from "@/lib/utils";
import React from "react";
import TransactionsTable from "./TransactionsTable";

const TransactionContent = () => {
  return (
    <div className="mx-auto space-y-3 w-full overflow-auto">
      <div className="flex flex-row justify-between items-center">
        <div>
          <h1 className={cn("scroll-m-20 text-3xl font-bold tracking-tight")}>
            Transactions
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage Transactions here.
          </p>
        </div>
      </div>
      <TransactionsTable />
    </div>
  );
};

export default TransactionContent;
