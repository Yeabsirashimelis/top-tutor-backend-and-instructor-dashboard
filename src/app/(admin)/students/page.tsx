"use client";

import StudentList from "../_components/student-list";
import { useGetInstructor } from "../_hooks/instructor-hooks";

export default function InstructorStudentsPage() {
  const { data: instructor } = useGetInstructor();
  const instructorId = instructor?._id || instructor?.id;

  if (!instructorId) return null;

  return <StudentList instructorId={instructorId} />;
}
