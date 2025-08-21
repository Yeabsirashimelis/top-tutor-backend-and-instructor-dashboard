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
import { CircleX, Loader, Loader2, PlusIcon } from "lucide-react";
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
import { useAddCategory, useUpdateCategory } from "../_hooks/course-hooks";
import { ProductCategory } from "@prisma/client";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string(),
});

const EditCourseDialog = ({
  categoryToEdit,
  setCategoryToEdit,
}: {
  categoryToEdit: ProductCategory | null;
  setCategoryToEdit: (category: ProductCategory | null) => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: categoryToEdit?.name || "",
      description: categoryToEdit?.description || "",
    },
  });
  const [isOpen, setIsOpen] = useState(false);
  const [coverImage, setCoverImage] = useState<string | undefined>(
    categoryToEdit?.coverImage ?? undefined
  );
  const [coverImageKey, setCoverImageKey] = useState<string | undefined>(
    undefined
  );
  const { mutate: updateCategory, isPending: updateCategoryPending } =
    useUpdateCategory();
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!categoryToEdit) return;
    updateCategory(
      {
        id: categoryToEdit?.id,
        name: values.name,
        description: values.description,
        ...(coverImage &&
          coverImage !== categoryToEdit.coverImage && {
            coverImage: coverImage,
          }),
        ...(coverImageKey &&
          coverImageKey !== categoryToEdit.coverImageKey && {
            coverImageKey: coverImageKey,
          }),
      },
      {
        onSuccess: () => {
          form.reset();
          setCategoryToEdit(null);
          toast({
            title: "Category updated successfully.",
            description: "Category updated successfully.",
            variant: "default",
            duration: 3000,
          });
        },
        onError: (error) => {
          toast({
            title: "Error updating category.",
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
      open={categoryToEdit !== null}
      onOpenChange={async (val) => {
        setCoverImage(undefined);
        setCoverImageKey(undefined);
        setCategoryToEdit(null);
        form.reset();
        if (coverImageKey) {
          await betterFetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/uploadthing/delete/${coverImageKey}`,
            {
              method: "DELETE",
            }
          );
        }
      }}
    >
      <DialogTrigger>
        <div className="flex items-center justify-center border rounded-lg w-10 h-10 ">
          <PlusIcon className="w-6 h-6" />
        </div>
      </DialogTrigger>
      <DialogOverlay className="">
        <DialogContent className="max-w-[500px] flex flex-col  h-[80vh] p-8">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={`${
                        categoryToEdit?.name !== form.getValues().name
                          ? "text-yellow-500"
                          : ""
                      }`}
                    >
                      Category Name*
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={`${
                        categoryToEdit?.description !==
                        form.getValues().description
                          ? "text-yellow-500"
                          : ""
                      }`}
                    >
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="">
                <FormLabel>Cover Image</FormLabel>
                {coverImage ? (
                  <div className="relative py-3 px-1">
                    <Image
                      src={coverImage}
                      alt="Driver License"
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
                          {
                            method: "DELETE",
                          }
                        );
                      }}
                    />
                  </div>
                ) : (
                  <FileUploadButton
                    onClientUploadComplete={(res) => {
                      setCoverImage(res[0].url);
                      setCoverImageKey(res[0].key);
                      console.log("Files: ", res);
                    }}
                    onUploadError={(error: Error) => {
                      alert(`ERROR! ${error.message}`);
                    }}
                    buttonText="Upload Cover Image"
                  />
                )}
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={updateCategoryPending}>
                  Update Category
                  {updateCategoryPending && <Loader className="animate-spin" />}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default EditCourseDialog;
