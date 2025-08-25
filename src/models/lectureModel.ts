import { Schema, model, models } from "mongoose";

const LectureSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "A lecture must have a title"],
    },
    videoUrl: {
      type: String,
      required: [true, "A lecture must have a video"],
    },
    lectureDuration: {
      type: Number,
      required: [true, " a lecture must have a duration"],
    },
    section: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      required: [true, "A lecture must belong to a section"],
    },
    order: {
      type: Number, // to keep order of lectures inside a section
      default: 0,
    },
    resources: [
      {
        type: String, // optional: PDF/Doc/extra links
      },
    ],
  },
  { timestamps: true }
);

LectureSchema.index({ order: 1, section: 1 }, { unique: true });

const Lecture = models.Lecture || model("Lecture", LectureSchema);

export default Lecture;
