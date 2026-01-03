import React from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import CoursesContent from "./_components/CoursesContent";

const CoursesPage = async () => {
  const queryClient = new QueryClient();

  // Remove prefetch - let client-side hook handle it with proper auth
  // The useGetCourses hook will fetch with session context

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CoursesContent />
    </HydrationBoundary>
  );
};

export default CoursesPage;
