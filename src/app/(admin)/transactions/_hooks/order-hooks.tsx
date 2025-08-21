import { betterFetch } from "@better-fetch/fetch";
import { Product, ProductCategory } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { string } from "zod";

// query functions
const getTransactions = async () => {
  const res = await betterFetch<Product[]>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/transactions`
  );
  return res.data;
};

export const useGetTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(),
  });
};
