import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetCourseChallenges = (courseId: string) => {
  return useQuery({
    queryKey: ["course-challenges", courseId],
    queryFn: async () => {
      const res = await fetch(
        `/api/instructor/courses/${courseId}/challenges`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch challenges");
      }

      return res.json();
    },
  });
};

export const useCreateChallenge = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { date: string; challenges: any[] }) => {
      const res = await fetch(
        `/api/instructor/courses/${courseId}/challenges`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create challenge");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-challenges", courseId],
      });
    },
  });
};

export const useUpdateChallenge = (courseId: string, challengeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { challenges?: any[]; isActive?: boolean }) => {
      const res = await fetch(
        `/api/instructor/courses/${courseId}/challenges/${challengeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update challenge");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-challenges", courseId],
      });
    },
  });
};

export const useDeleteChallenge = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (challengeId: string) => {
      const res = await fetch(
        `/api/instructor/courses/${courseId}/challenges/${challengeId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete challenge");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-challenges", courseId],
      });
    },
  });
};
