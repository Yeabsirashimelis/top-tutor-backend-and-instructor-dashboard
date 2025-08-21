import { Schema, model, models } from "mongoose";

const SectionSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "A section must have a name"],
      trim: true,
      maxlength: [40, "A section name must have less or equal 40 characters"],
      minlength: [5, "A section name must have more or equal 5 characters"],
    },
    order: {
      type: Number,
      required: [true, "A section must have an order"],
    },
    sectionDuration: {
      type: Number,
      default: 0,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "A section must be part of a course"],
    },
  },
  { timestamps: true }
);

// Ensure title is unique per course
SectionSchema.index({ title: 1, course: 1 }, { unique: true });

// Ensure order is unique per course
SectionSchema.index({ order: 1, course: 1 }, { unique: true });

const Section = models.Section || model("Section", SectionSchema);

export default Section;
