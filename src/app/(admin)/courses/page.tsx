import React from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { betterFetch } from "@better-fetch/fetch";
import CoursesContent from "./_components/CoursesContent";
import { Course } from "@/types/types";

const CoursesPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await betterFetch<{ message: string; courses: Course[] }>(
        "http://localhost:3000/api/courses"
      );
      return res.data?.courses;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CoursesContent />
    </HydrationBoundary>
  );
};

export default CoursesPage;
