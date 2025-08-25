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
