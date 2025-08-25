import { toast } from "@/hooks/use-toast"; // if you want to keep toast here
import type { FieldValues, UseFormSetValue } from "react-hook-form";
import type { z } from "zod";

interface UploadVideoOptions<T extends FieldValues> {
  file: File;
  setVideoUrl: (url: string) => void;
  setThumbnail: (url: string) => void;
  setUploading: (uploading: boolean) => void;
  formSetValue: UseFormSetValue<T>;
}

export const handleVideoUpload = async <T extends FieldValues>({
  file,
  setVideoUrl,
  setThumbnail,
  setUploading,
  formSetValue,
}: UploadVideoOptions<T>) => {
  try {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    // Upload to lectures folder if needed
    // formData.append("folder", "lectures");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    setVideoUrl(data.secure_url);
    formSetValue("videoUrl" as any, data.secure_url);

    // Calculate duration in hours
    if (data.duration) {
      formSetValue(
        "lectureDuration" as any,
        (Number(data.duration) / 3600) as any
      );
    }

    // Generate thumbnail
    const thumbnailUrl = data.secure_url.replace(
      "/upload/",
      "/upload/w_300,h_200,c_fill/"
    );
    setThumbnail(thumbnailUrl);

    toast({
      title: "Video uploaded",
      description: "Video uploaded successfully",
    });
  } catch (error) {
    toast({
      title: "Upload failed",
      description: "Could not upload video",
      variant: "destructive",
    });
  } finally {
    setUploading(false);
  }
};
