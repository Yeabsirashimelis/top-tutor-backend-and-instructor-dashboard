"use client";
import React, { useState } from "react";

import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CircleX, Loader, PlusIcon } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { betterFetch } from "@better-fetch/fetch";
import Image from "next/image";
import FileUploadButton from "@/components/FileUploadButton";
import { courseSchema } from "@/types/types";
import { useAddCourse } from "../_hooks/course-hooks";

const AddCoursesDialog = () => {
  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      courseType: "",
      language: "",
      skillLevel: "",
      courseDuration: 0,
      learningOutcomes: [""],
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined);
  const [coverImageKey, setCoverImageKey] = useState<string | undefined>(
    undefined
  );

  const { mutate: addCourse, isPending: addCoursePending } = useAddCourse();
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof courseSchema>) {
    console.log(values);
    console.log(coverImage);
    addCourse(
      {
        title: values.title,
        description: values.description,
        price: values.price,
        courseType: values.courseType,
        language: values.language,
        skillLevel: values.skillLevel,
        courseDuration: values.courseDuration,
        learningOutcomes: values.learningOutcomes,
        coverImage: coverImage,
      },
      {
        onSuccess: () => {
          // form.reset();
          setIsOpen(false);
          toast({
            title: "Course saved successfully.",
            description: "Course saved successfully.",
            variant: "default",
            duration: 3000,
          });
        },
        onError: (error) => {
          toast({
            title: "Error saving Course.",
            description: error.message,
            variant: "destructive",
            duration: 3000,
          });
        },
      }
    );
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={async (val) => {
        setIsOpen(val);
        setCoverImage(undefined);
        setCoverImageKey(undefined);
        form.reset();
        if (coverImageKey) {
          await betterFetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/uploadthing/delete/${coverImageKey}`,
            { method: "DELETE" }
          );
        }
      }}
    >
      <DialogTrigger>
        <div className="flex items-center justify-center border rounded-lg w-10 h-10 ">
          <PlusIcon className="w-6 h-6" />
        </div>
      </DialogTrigger>
      <DialogOverlay>
        <DialogContent className="max-w-[500px] flex flex-col h-[80vh] p-8 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Course</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Learn React Fast" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description*</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (ETB)</FormLabel>
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
              {/* Course Type */}
              <FormField
                control={form.control}
                name="courseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Type</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Academic, Programming"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Language */}
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. English" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Skill Level */}
              <FormField
                control={form.control}
                name="skillLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Level</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Beginner, University Level, HighSchool Level, Anyone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Duration */}
              <FormField
                control={form.control}
                name="courseDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Duration</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. 10, please use approximate hour"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Learning Outcomes (simple text array) */}
              <FormField
                control={form.control}
                name="learningOutcomes"
                render={({ field }) => {
                  const [text, setText] = useState(field.value.join(", "));
                  return (
                    <FormItem>
                      <FormLabel>Learning Outcomes</FormLabel>
                      <FormControl>
                        <Textarea
                          value={text}
                          rows={3}
                          placeholder="Write outcomes separated by commas"
                          onChange={(e) => setText(e.target.value)}
                          onBlur={() => {
                            // Update the form value as an array when leaving the field
                            field.onChange(
                              text
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean)
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Cover Image */}
              <div>
                <FormLabel>Cover Image</FormLabel>
                {coverImage ? (
                  <div className="relative py-3 px-1">
                    <Image
                      src={coverImage}
                      alt="Cover"
                      height={1000}
                      width={1000}
                      className="w-full h-[8vh] object-cover my-2"
                    />
                    <CircleX
                      className="absolute -top-2 right-0 text-red-500 cursor-pointer"
                      onClick={async () => {
                        setCoverImage(undefined);
                        await fetch(
                          `/api/uploadthing/delete/${coverImageKey}`,
                          { method: "DELETE" }
                        );
                      }}
                    />
                  </div>
                ) : (
                  <FileUploadButton
                    onClientUploadComplete={(res) => {
                      setCoverImage(res[0].url);
                      setCoverImageKey(res[0].key);
                    }}
                    onUploadError={(error: Error) => {
                      alert(`ERROR! ${error.message}`);
                    }}
                    buttonText="Upload Cover Image"
                  />
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <Button type="submit" className="bg-indigo-600">
                  Save Course
                  {form.formState.isSubmitting && (
                    <Loader className="animate-spin ml-2" />
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default AddCoursesDialog;
