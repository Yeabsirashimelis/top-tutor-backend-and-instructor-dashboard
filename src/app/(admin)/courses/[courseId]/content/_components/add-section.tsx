"use client";

import { z } from "zod";
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
import { SectionSchema } from "@/types/types";
import { useAddSection } from "../_hooks/course-section-hooks";
import { useParams } from "next/navigation";

const AddSection = () => {
  const form = useForm<z.infer<typeof SectionSchema>>({
    resolver: zodResolver(SectionSchema),
    defaultValues: {
      title: "",
      order: 1,
      sectionDuration: null,
    },
  });

  const { courseId } = useParams();
  console.log(courseId);

  const { mutate: addSection, isPending } = useAddSection();
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof SectionSchema>) {
    addSection(
      {
        ...values,
        course: courseId as string,
      },
      {
        onSuccess: () => {
          form.reset();
          toast({
            title: "Section added successfully",
            description: `${values.title} was added to course.`,
            duration: 3000,
          });
        },
        onError: (error) => {
          toast({
            title: "Error adding section",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  }

  return (
    <Card className="w-full mx-auto mt-6 shadow-md">
      <CardHeader>
        <CardTitle>Add Section</CardTitle>
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
                      //   {...field}
                      //   onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-sm ml-4  text-blue-600">
              we will calculate the section duration for you.
            </div>

            <CardFooter className="flex justify-end px-0">
              <button
                type="submit"
                disabled={isPending}
                className="bg-indigo-600 hover:bg-indigo-500 h-9 px-4 py-2 rounded-md shadow font-bold flex items-center justify-center"
              >
                Save Section
                {isPending && <Loader className="ml-2 h-4 w-4 animate-spin" />}
              </button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddSection;
