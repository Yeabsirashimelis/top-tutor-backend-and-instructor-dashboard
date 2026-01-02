import { Schema, model, models } from "mongoose";

const RecentlyViewedSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Ensure a user can only have one entry per course (will update viewedAt on re-view)
RecentlyViewedSchema.index({ user: 1, course: 1 }, { unique: true });

// Index for sorting by viewedAt
RecentlyViewedSchema.index({ user: 1, viewedAt: -1 });

const RecentlyViewed = models.RecentlyViewed || model("RecentlyViewed", RecentlyViewedSchema);

export default RecentlyViewed;
