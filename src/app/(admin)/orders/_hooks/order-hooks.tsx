import { betterFetch } from "@better-fetch/fetch";
import { Orders, Product, ProductCategory } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// query functions
const getOrders = async () => {
  const res = await betterFetch<Orders[]>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`
  );
  return res.data;
};

const getSpecificOrder = async (id: string) => {
  const res = await betterFetch<Orders>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${id}`
  );
  return res.data;
};

const updateOrder = async ({ id, status }: { id: string; status: string }) => {
  const { data: updatedOrder, error } = await betterFetch<Orders>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${id}`,
    {
      method: "PATCH",
      body: {
        status: status,
      },
    }
  );
  if (updatedOrder) {
    return updatedOrder;
  }
  throw new Error(error?.message || "An error occurred");
};

export const useGetOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });
};

export const useGetSpecificOrder = (id: string) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: ({ queryKey }) => {
      const [, orderId] = queryKey;
      return getSpecificOrder(orderId as string);
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; status: string }) => updateOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
