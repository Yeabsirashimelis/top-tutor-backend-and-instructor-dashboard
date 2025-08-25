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
import { Loader } from "lucide-react";
import { Section } from "@/types/types";
import { useDeleteSection } from "../_hooks/course-section-hooks";
import { useParams } from "next/navigation";

const DeleteSectionDialog = ({
  sectionToDelete,
  setSectionToDelete,
}: {
  sectionToDelete: Section | null;
  setSectionToDelete: (section: Section | null) => void;
}) => {
  const { toast } = useToast();
  const { mutate: deleteSection, isPending } = useDeleteSection();

  const { courseId } = useParams();
  return (
    <Dialog
      open={sectionToDelete !== null}
      onOpenChange={() => setSectionToDelete(null)}
    >
      <DialogTrigger></DialogTrigger>
      <DialogOverlay>
        <DialogContent className="w-[450px] p-8">
          <DialogHeader>
            <DialogTitle>Delete Section [{sectionToDelete?.title}]</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this section?
            <p>the videos and all related material will also be removed.</p>
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSectionToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!sectionToDelete) return;
                deleteSection(
                  {
                    courseId: courseId as string,
                    sectionId: sectionToDelete._id,
                  },
                  {
                    onSuccess: () => {
                      toast({
                        title: "Section Deleted",
                        description: "Section has been deleted successfully",
                      });
                      setSectionToDelete(null);
                    },
                    onError: (error: any) => {
                      toast({
                        title: "Error Deleting Section",
                        description: error.message,
                        variant: "destructive",
                      });
                    },
                  }
                );
              }}
              disabled={isPending}
            >
              Delete
              {isPending && <Loader className="animate-spin ml-2" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default DeleteSectionDialog;
