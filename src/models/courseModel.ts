import { Schema, model, models } from "mongoose";

const CourseSchema = new Schema(
  {
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A course must have an instructor"],
    },
    title: {
      type: String,
      required: [true, "A course must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A course name must have less or equal 40 characters"],
      minlength: [5, "A course name must have more or equal 5 characters"],
    },
    coverImage: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: [true, "A course must have a description"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "A course must have a price"],
    },
    courseType: {
      type: String,
      required: [true, "A course must have a course type"],
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    language: {
      type: String,
      required: [true, "course language should be specified"],
      trim: true,
    },
    skillLevel: {
      type: String,
      required: [true, "A course must have a skill level"],
      trim: true,
    },
    courseDuration: {
      type: Number,
      required: [true, "A course must have a duration"],
    },
    learningOutcomes: {
      type: [String],
      validate: {
        validator: function (outcomes: string) {
          return outcomes && outcomes.length > 0;
        },
        message: "Please provide at least one learning outcome",
      },
    },
  },
  { timestamps: true }
);

const Course = models.Course || model("Course", CourseSchema);
export default Course;
