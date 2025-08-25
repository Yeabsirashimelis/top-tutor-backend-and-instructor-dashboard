"use client";

import type { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SectionSchema, Section } from "@/types/types";
import { useUpdateSection } from "../_hooks/course-section-hooks";
import { useParams } from "next/navigation";

interface EditSectionDialogProps {
  sectionToEdit: Section | null;
  setSectionToEdit: (section: Section | null) => void;
}

const EditSectionDialog = ({
  sectionToEdit,
  setSectionToEdit,
}: EditSectionDialogProps) => {
  const { toast } = useToast();
  const { mutate: updateSection, isPending } = useUpdateSection();
  const { courseId } = useParams();

  const form = useForm<z.infer<typeof SectionSchema>>({
    resolver: zodResolver(SectionSchema),
    defaultValues: {
      title: sectionToEdit?.title?.toString() ?? "",
      order: sectionToEdit?.order ?? 1,
      sectionDuration: sectionToEdit?.sectionDuration ?? null,
    },
    values: {
      title: sectionToEdit?.title?.toString() ?? "",
      order: sectionToEdit?.order ?? 1,
      sectionDuration: sectionToEdit?.sectionDuration ?? null,
    },
  });

  async function onSubmit(values: z.infer<typeof SectionSchema>) {
    if (!sectionToEdit) return;

    updateSection(
      { courseId: courseId as string, sectionId: sectionToEdit._id, ...values },
      {
        onSuccess: () => {
          toast({
            title: "Section updated successfully",
            description: `${values.title} was updated.`,
            duration: 3000,
          });
          setSectionToEdit(null);
        },
        onError: (error) => {
          toast({
            title: "Error updating section",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  }

  return (
    <Dialog open={!!sectionToEdit} onOpenChange={() => setSectionToEdit(null)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Section</DialogTitle>
          <DialogDescription>
            Update details for this section.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Title*</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Introduction" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Order */}
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order*</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Duration */}
            <FormField
              control={form.control}
              name="sectionDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (hrs)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      //  {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-sm ml-1 text-blue-600">
              We will calculate the section duration for you.
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSectionToEdit(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                Save Changes
                {isPending && <Loader className="ml-2 h-4 w-4 animate-spin" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSectionDialog;
