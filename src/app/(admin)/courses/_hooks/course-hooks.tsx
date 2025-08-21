import { Course } from "@/types/types";
import { betterFetch } from "@better-fetch/fetch";
import { ProductCategory } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// query functions
export const getCourses = async () => {
  const res = await betterFetch<{ message: string; courses: Course[] }>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses`
  );

  return res.data?.courses || [];
};

export const getCourse = async (id: string) => {
  const res = await betterFetch<{ message: string; course: Course }>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${id}`
  );
  if (!res.data?.course) {
    throw new Error(res.data?.message || "Course not found");
  }
  return res.data.course;
};

// mutation functions

export const addCourse = async (data: {
  title: string;
  description: string;
  price: number;
  courseType: string;
  language: string;
  skillLevel: string;
  courseDuration: number;
  learningOutcomes: string[];
  coverImage?: string;
  coverImageKey?: string;
}) => {
  const { data: newCourse, error } = await betterFetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses`,
    {
      method: "POST",
      body: data,
    }
  );

  if (newCourse) {
    return newCourse;
  }
  throw new Error(error?.message);
};

const deleteCourse = async (id: string) => {
  const { data, error } = await betterFetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${id}`,
    {
      method: "DELETE",
    }
  );
  if (data) {
    return data;
  }
  throw new Error(error?.message);
};

const updateCatgory = async (data: {
  id: string;
  name?: string;
  description?: string;
  coverImage?: string;
  coverImageKey?: string;
}) => {
  const { data: updatedCategory, error } = await betterFetch<ProductCategory>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/product-categories/${data.id}`,
    {
      method: "PUT",
      body: {
        name: data.name,
        description: data.description,
        coverImage: data.coverImage,
        coverImageKey: data.coverImage,
      },
    }
  );
  if (updatedCategory) {
    return updatedCategory;
  }
  throw new Error(error.message);
};

export const useGetCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => getCourses(),
  });
};

export const useGetCourse = (id: string) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourse(id),
  });
};

export const useAddCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      title: string;
      description: string;
      price: number;
      courseType: string;
      language: string;
      skillLevel: string;
      courseDuration: number;
      learningOutcomes: string[];
      coverImage?: string;
      coverImageKey?: string;
    }) => addCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: string;
      name?: string;
      description?: string;
      coverImage?: string;
      coverImageKey?: string;
    }) => updateCatgory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
