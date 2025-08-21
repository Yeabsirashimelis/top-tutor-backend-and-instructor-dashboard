import React from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { betterFetch } from "@better-fetch/fetch";
import { ProductCategory } from "@prisma/client";
import TransactionContent from "./_components/TransactionsContent";

const Transactions = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await betterFetch<ProductCategory[]>(
        "http://localhost:3000/api/transactions"
      );
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TransactionContent />
    </HydrationBoundary>
  );
};

export default Transactions;
