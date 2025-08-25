import z from "zod";
import { Lecture, LectureSchema } from "@/types/types";
import { betterFetch } from "@better-fetch/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type LectureInput = z.infer<typeof LectureSchema> & { section: string };

//query functions
export const getSections = async (sectionId: string) => {
  const res = await betterFetch<{ message: string; lectures: Lecture[] }>(
    `${process.env.NEXT_PUBLIC_BASE_URL}//api/lectures`
  );

  return res.data?.lectures || [];
};

//mutation functions
export const addLecture = async (data: LectureInput) => {
  const { data: newLecture, error } = await betterFetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/lectures`,
    {
      method: "POST",
      body: data,
    }
  );

  if (newLecture) {
    return newLecture;
  }
  throw new Error(error?.message);
};

//hooks
export const useAddLecture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LectureInput) => addLecture(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
    },
  });
};

export const useGetLectures = (sectionId: string) => {
  return useQuery({
    queryKey: ["lectures", sectionId],
    queryFn: () => getSections(sectionId),
  });
};
