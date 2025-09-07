import z from "zod";
import { Lecture, LectureSchema, quizSchema } from "@/types/types";
import { betterFetch } from "@better-fetch/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type LectureInput = z.infer<typeof LectureSchema> & { section: string };
type QuizInput = z.infer<typeof quizSchema>;

//query functions
export const getLectures = async (sectionId: string) => {
  const res = await betterFetch<{ message: string; lectures: Lecture[] }>(
    `${process.env.NEXT_PUBLIC_BASE_URL}//api/lectures?sectionId=${sectionId}`
  );

  return res.data?.lectures || [];
};

export const getQuizzes = async (sectionId: string) => {
  const res = await betterFetch<{ message: string; quizzes: QuizInput[] }>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/quizzes?sectionId=${sectionId}`
  );

  return res.data?.quizzes || [];
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

export const addQuiz = async (data: QuizInput) => {
  const { data: newQuiz, error } = await betterFetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/quizzes`,
    {
      method: "POST",
      body: data,
    }
  );

  if (newQuiz) return newQuiz;
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
    queryFn: () => getLectures(sectionId),
  });
};

export const useAddQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: QuizInput) => addQuiz(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });
};

export const useGetQuizzes = (sectionId: string) => {
  return useQuery({
    queryKey: ["quizzes", sectionId],
    queryFn: () => getQuizzes(sectionId),
  });
};
