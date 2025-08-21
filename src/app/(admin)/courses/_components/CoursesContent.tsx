import { cn } from "@/lib/utils";
import React from "react";
import AddCoursesDialog from "./AddCoursesDialog";
import CoursesTable from "./CoursesTable";

const CoursesContent = () => {
  return (
    <div className="mx-auto space-y-3 w-full overflow-auto">
      <div className="flex flex-row justify-between items-center">
        <div>
          <h1 className={cn("scroll-m-20 text-3xl font-bold tracking-tight")}>
            Courses You Add
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage Courses You Add Here
          </p>
        </div>
        <div>
          <AddCoursesDialog />
        </div>
      </div>
      <CoursesTable />
    </div>
  );
};

export default CoursesContent;
