import { Schema, model, models } from "mongoose";

const LectureBookmarkSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lecture: {
      type: Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    timestamp: {
      type: Number,
      required: true,
      min: 0,
    },
    note: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
LectureBookmarkSchema.index({ user: 1, lecture: 1 });
LectureBookmarkSchema.index({ user: 1, course: 1 });

const LectureBookmark = models.LectureBookmark || model("LectureBookmark", LectureBookmarkSchema);

export default LectureBookmark;
