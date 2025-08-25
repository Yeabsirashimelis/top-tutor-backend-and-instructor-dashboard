"use client";

import { useParams, useSearchParams } from "next/navigation";
import AddSection from "./add-section";
import SectionTable from "./section-table";
import { useGetSections } from "../_hooks/course-section-hooks";

export default function CourseContentPageComponents() {
  const { courseId } = useParams();
  const { data: sections, isPending: isLoadingSections } = useGetSections(
    courseId as string
  );

  const searchParams = useSearchParams();
  const title = searchParams.get("title");

  return (
    <div className="space-y-12 w-[99%] mx-auto">
      <h1 className=" mb-6 text-3xl">
        Manage Course "
        <span className="font-bold uppercase text-indigo-600">{title}</span>"
        here
      </h1>
      <div className=" ">
        <AddSection />

        <div className="lg:w-[99%] w-screen overflow-auto mt-12">
          <SectionTable
            sections={sections || []}
            isLoading={isLoadingSections}
          />
        </div>
      </div>
      {/* <AddSection />
      <SectionTable sections={sections || []} isLoading={isLoadingSections} /> */}
    </div>
  );
}
