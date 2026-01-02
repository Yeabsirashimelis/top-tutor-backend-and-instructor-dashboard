"use client";

import AnnouncementCreator from "../_components/announcement-creator";
import { useGetInstructor } from "../_hooks/instructor-hooks";
import { useQuery } from "@tanstack/react-query";

export default function InstructorAnnouncementsPage() {
  const { data: instructor } = useGetInstructor();
  const instructorId = instructor?._id || instructor?.id;

  const { data: courses } = useQuery({
    queryKey: ["instructor-courses", instructorId],
    queryFn: async () => {
      if (!instructorId) return [];
      const res = await fetch(`/api/courses?instructorId=${instructorId}`);
      const data = await res.json();
      return data.courses || [];
    },
    enabled: !!instructorId,
  });

  if (!instructorId) return null;

  return (
    <div className="space-y-6">
      <AnnouncementCreator instructorId={instructorId} courses={courses || []} />
      {/* TODO: Add announcement list/table here */}
    </div>
  );
}
