import { z } from "zod";

export const courseSchema = z.object({
  title: z
    .string()
    .nonempty("course title is needed")
    .min(5, { message: "Title must be at least 5 characters long" })
    .max(40, { message: "Title must be at most 40 characters long" }),

  description: z
    .string()
    .nonempty("course description is needed")
    .min(20, { message: "description must be at least 20 characters long" }),
  price: z.coerce.number().positive("Price must be greater than 0"),
  courseType: z.string().nonempty("course type is needed"),
  language: z.string().nonempty("course language should be specified"),
  coverImage: z.string().optional(),
  skillLevel: z.string().nonempty("course skill level should be specified"),
  courseDuration: z.coerce
    .number()
    .positive("course duration is needed and be greater than 0"),
  learningOutcomes: z
    .array(z.string())
    .min(1, "At least one learning outcome is required")
    .max(20, "Maximum 10 learning outcomes allowed"),
});

export type Course = {
  _id: string;
  instructor: string;
  title: string;
  coverImage: string;
  description: string;
  price: number;
  courseType: string;
  language: string;
  skillLevel: string;
  courseDuration: number;
  learningOutcomes: string[];

  ratingsAverage?: number;
  ratingsQuantity?: number;
  createdAt?: string;
  updatedAt?: string;
};

export const SectionSchema = z.object({
  title: z
    .string()
    .nonempty("section title is needed")
    .min(5, { message: "Title must be at least 5 characters long" })
    .max(40, { message: "Title must be at most 40 characters long" }),
  sectionDuration: z.coerce
    .number()
    .positive("section duration is needed and be greater than 0")
    .nullable()
    .optional(),

  order: z.coerce
    .number()
    .positive("section order is needed and be greater than 0"),
});

export type Section = {
  _id: string;
  title: String;
  order: number;
  sectionDuration?: number;
};

export const LectureSchema = z.object({
  title: z
    .string()
    .nonempty("Lecture title is required")
    .min(5, { message: "Title must be at least 5 characters long" })
    .max(40, { message: "Title must be at most 40 characters long" }),

  order: z.coerce
    .number()
    .int("Order must be an integer")
    .positive("Lecture order must be greater than 0"),

  videoUrl: z
    .string()
    .url("Video URL must be a valid URL")
    .nonempty("A lecture must have a video uploaded"),

  lectureDuration: z
    .number()
    .min(0, { message: "Duration cannot be negative" })
    .default(0),

  section: z.string().nonempty("A lecture must belong to a section"), // sectionId reference
});

export type Lecture = {
  _id: string;
  title: String;
  order: number;
  lectureDuration?: number;
  videoUrl: string;
  section: string;
};

export const quizOptionSchema = z.object({
  text: z.string().nonempty("Option text is required"),
  isCorrect: z.boolean().optional().default(false),
});

export const quizQuestionSchema = z.object({
  questionText: z.string().nonempty("Question text is required"),
  options: z
    .array(quizOptionSchema)
    .min(2, "At least two options are required")
    .max(6, "Maximum 6 options allowed"),
  explanation: z.string().optional(),
  order: z.number().int().positive("Order must be a positive integer"),
});

export const quizSchema = z.object({
  _id: z.string().optional(),
  title: z.string().nonempty("Quiz title is required"),
  sectionId: z.string().nonempty("Section ID is required"),
  order: z.number().int().positive("Order must be a positive integer"),
  questions: z
    .array(quizQuestionSchema)
    .min(1, "At least one question is required"),
});

export const instructorSchema = z.object({
  name: z.string().min(5, "Name too short").max(40, "Name too long"),
  bio: z.string().optional(),
  title: z.string().optional(),
  socialLinks: z.object({
    website: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
  }),
  skills: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  avatar: z.string().url().optional(),
  email: z.string().email(),
});
