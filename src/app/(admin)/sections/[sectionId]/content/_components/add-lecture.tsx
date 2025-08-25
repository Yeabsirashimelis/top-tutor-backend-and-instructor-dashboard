"use client";

import { useState } from "react";
import Image from "next/image";
import type { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
import { LectureSchema } from "@/types/types";
import { useAddLecture } from "../_hooks/section-lecture-hooks";
import { useParams } from "next/navigation";
import { handleVideoUpload } from "../../../../../../../utils/upload-lecture-video";

const AddLecture = () => {
  const { sectionId } = useParams();

  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState(""); //just i name it thumbnail, it is the uploaded video

  console.log(thumbnail);

  const form = useForm<z.infer<typeof LectureSchema>>({
    resolver: zodResolver(LectureSchema),
    defaultValues: {
      title: "",
      order: 1,
      lectureDuration: 0,
      section: sectionId as string,
      videoUrl: "",
    },
  });

  const { toast } = useToast();
  const { mutate: addLecture, isPending } = useAddLecture();

  // Upload to Cloudinary
  // ... keep imports and hooks as-is

  const onSubmit = (values: z.infer<typeof LectureSchema>) => {
    addLecture(
      { ...values },
      {
        onSuccess: () => {
          form.reset({ section: sectionId as string });
          setVideoUrl("");
          toast({
            title: "Lecture added",
            description: `${values.title} was added.`,
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Card className="w-[90%] md:w-[50%]  shadow-md">
      <CardHeader>
        <CardTitle>Add Lecture</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lecture Title*</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Introduction to React"
                    />
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

            {/* Video Upload */}
            <FormItem>
              <FormLabel>Video*</FormLabel>
              <FormControl>
                {!videoUrl ? (
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      if (e.target.files?.[0])
                        handleVideoUpload({
                          file: e.target.files[0],
                          setVideoUrl,
                          setThumbnail,
                          setUploading,
                          formSetValue: form.setValue,
                        });
                    }}
                    disabled={uploading}
                  />
                ) : (
                  <video
                    src={thumbnail}
                    controls
                    width={640}
                    height={360}
                    className="rounded-md"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </FormControl>
              <FormMessage />
              {uploading && (
                <div className="text-sm flex gap-1 text-blue-600">
                  Uploading video
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                </div>
              )}
            </FormItem>

            {/* Duration (calculated automatically) */}
            <FormField
              control={form.control}
              name="lectureDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (hrs)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                  <div className="text-sm ml-1 text-blue-600">
                    Duration is calculated automatically after video upload
                  </div>
                </FormItem>
              )}
            />

            <CardFooter className="flex justify-end px-0">
              <button
                className="bg-indigo-600 text-black hover:bg-indigo-500 h-9 px-4 py-2 rounded-md shadow font-bold flex items-center justify-center"
                type="submit"
                disabled={isPending || uploading}
              >
                {isPending ? (
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Save Lecture
              </button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddLecture;
