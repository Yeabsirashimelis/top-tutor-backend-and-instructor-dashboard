import { betterFetch } from "@better-fetch/fetch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Query functions

export const getInstructor = async () => {
  const res = await betterFetch<{ message: string; user: any }>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/instructor`
  );
  if (!res.data?.user)
    throw new Error(res.data?.message || "Instructor not found");

  return res.data.user;
};

// Mutation functions

export const updateInstructor = async (data: any) => {
  const { data: updated, error } = await betterFetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/instructor`,
    {
      method: "PUT",
      body: data,
    }
  );
  if (updated) return updated;
  throw new Error(error?.message);
};

// ------------------
// React Query Hooks
// ------------------

export const useGetInstructor = () => {
  return useQuery({
    queryKey: ["instructor"],
    queryFn: () => getInstructor(),
  });
};

export const useUpdateInstructor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => updateInstructor(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["instructor"] }),
  });
};
