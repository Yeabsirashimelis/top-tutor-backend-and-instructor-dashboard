import { Schema, Types, model, models } from "mongoose";

const courseReviewSchema = new Schema(
  {
    courseId: {
      type: Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewText: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

courseReviewSchema.index({ courseId: 1, userId: 1 }, { unique: true });

const CourseReview = models.CourseReview || model("Note", courseReviewSchema);
export default CourseReview;
