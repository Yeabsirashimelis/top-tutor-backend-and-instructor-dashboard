"use client";

import { useParams, useSearchParams } from "next/navigation";
import AddLecture from "./add-lecture";
import LectureTable from "./lecture-table";
import { useGetLectures } from "../_hooks/section-lecture-hooks";

export default function SectionContentPageComponents() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const { sectionId } = useParams();
  const { data: lectures, isPending: isLoadingLectures } = useGetLectures(
    sectionId as string
  );

  return (
    <div className="w-[99%]">
      <h1 className=" mb-6 text-3xl">
        Manage Section "
        <span className="font-bold uppercase text-indigo-600">{title}</span>"
        here
      </h1>
      <div className="space-y-12  mx-auto">
        <div className=" ">
          <AddLecture />

          <div className="lg:w-[99%] w-screen overflow-auto mt-12">
            <LectureTable
              lectures={lectures || []}
              isLoading={isLoadingLectures}
            />
          </div>
        </div>
        {/* <AddSection />
          <SectionTable sections={sections || []} isLoading={isLoadingSections} /> */}
      </div>
    </div>
  );
}
