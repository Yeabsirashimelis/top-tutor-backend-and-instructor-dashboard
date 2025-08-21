"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader, Loader2 } from "lucide-react";
import { Course } from "@/types/types";
import { useDeleteCourse } from "../_hooks/course-hooks";

const DeleteCourseDialog = ({
  courseToDelete,
  setCourseToDelete,
}: {
  courseToDelete: Course | null;
  setCourseToDelete: (id: Course | null) => void;
}) => {
  const { toast } = useToast();
  const { mutate: deleteCourse, isPending } = useDeleteCourse();

  return (
    <Dialog
      open={courseToDelete !== null}
      onOpenChange={() => setCourseToDelete(null)}
    >
      <DialogTrigger></DialogTrigger>
      <DialogOverlay className=" ">
        <DialogContent className="w-[450px] p-8">
          <DialogHeader>
            <DialogTitle>Delete Course [{courseToDelete?.title}]</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this course?
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCourseToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!courseToDelete) return;
                deleteCourse(courseToDelete._id, {
                  onSuccess: (error: any) => {
                    toast({
                      title: "Course Deleted",
                      description: "Course has been deleted successfully",
                    });
                    setCourseToDelete(null);
                  },
                  onError: (error: any) => {
                    toast({
                      title: "Error Deleting Course",
                      description: error.message,
                      variant: "destructive",
                    });
                  },
                });
              }}
              disabled={isPending}
            >
              Delete
              {isPending && <Loader className="animate-spin" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default DeleteCourseDialog;
