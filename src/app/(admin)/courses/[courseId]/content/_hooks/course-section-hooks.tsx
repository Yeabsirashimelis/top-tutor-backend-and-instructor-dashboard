import z from "zod";
import { Section, SectionSchema } from "@/types/types";
import { betterFetch } from "@better-fetch/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type SectionInput = z.infer<typeof SectionSchema> & { course: string };

//query functions
export const getSections = async (courseId: string) => {
  const res = await betterFetch<{ message: string; sections: Section[] }>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${courseId}/section`
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

const deleteSection = async (courseId: string, sectionId: string) => {
  const { data, error } = await betterFetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${courseId}/section/${sectionId}`,

    {
      method: "DELETE",
    }
  );
  if (data) {
    return data;
  }
  throw new Error(error?.message);
};

const updateSection = async (data: {
  courseId: string;
  sectionId: string;
  title?: string;
  order?: number;
  sectionDuration?: number | null;
}) => {
  const { data: updatedSection, error } = await betterFetch<Section>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${data.courseId}/section/${data.sectionId}`,
    {
      method: "PUT",
      body: {
        title: data.title,
        order: data.order,
        sectionDuration: data.sectionDuration,
      },
    }
  );

  if (updatedSection) {
    return updatedSection;
  }
  throw new Error(error.message);
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

export const useDeleteSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      sectionId,
    }: {
      courseId: string;
      sectionId: string;
    }) => deleteSection(courseId, sectionId),
    onSuccess: (_, variables) => {
      // invalidate sections of the specific course
      queryClient.invalidateQueries({
        queryKey: ["sections", variables.courseId],
      });
    },
  });
};

export const useUpdateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      courseId: string;
      sectionId: string;
      title?: string;
      order?: number;
      sectionDuration?: number | null;
    }) => updateSection(data),
    onSuccess: (_data, variables) => {
      // refetch the sections for this course
      queryClient.invalidateQueries({
        queryKey: ["sections", variables.courseId],
      });
    },
  });
};
