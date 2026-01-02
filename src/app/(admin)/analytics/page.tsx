"use client";

import AnalyticsDashboard from "../_components/analytics-dashboard";
import { useGetInstructor } from "../_hooks/instructor-hooks";

export default function InstructorAnalyticsPage() {
  const { data: instructor } = useGetInstructor();
  const instructorId = instructor?._id || instructor?.id;

  if (!instructorId) return null;

  return <AnalyticsDashboard instructorId={instructorId} />;
}
