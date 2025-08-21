import z from "zod";
import { Section, SectionSchema } from "@/types/types";
import { betterFetch } from "@better-fetch/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type SectionInput = z.infer<typeof SectionSchema> & { course: string };

//query functions
export const getSections = async (courseId: string) => {
  const res = await betterFetch<{ message: string; sections: Section[] }>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses${courseId}/section`
  );

  return res.data?.sections || [];
};

//mutation functions
export const addSection = async (data: SectionInput) => {
  const { data: newSection, error } = await betterFetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${data.course}/section`,
    {
      method: "POST",
      body: data,
    }
  );

  if (newSection) {
    return newSection;
  }
  throw new Error(error?.message);
};

//hooks
export const useAddSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SectionInput) => addSection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
  });
};

export const useGetSections = (courseId: string) => {
  return useQuery({
    queryKey: ["sections", courseId],
    queryFn: () => getSections(courseId),
  });
};
