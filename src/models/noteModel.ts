import mongoose, { Schema, models, model } from "mongoose";

const NoteSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    sectionId: { type: String, required: true },
    lectureId: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

delete mongoose.models.Note;
const Note = models.Note || model("Note", NoteSchema);
export default Note;
