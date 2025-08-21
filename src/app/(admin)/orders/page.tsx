import React from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { betterFetch } from "@better-fetch/fetch";
import { ProductCategory } from "@prisma/client";
import OrdersContent from "./_components/OrdersContent";

const Orders = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await betterFetch<ProductCategory[]>(
        "http://localhost:3000/api/orders"
      );
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrdersContent />
    </HydrationBoundary>
  );
};

export default Orders;
