import { Schema, model, models } from "mongoose";

const AssignmentSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "An assignment must have a title"],
    },
    description: {
      type: String,
      required: true,
    },
    section: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      required: [true, "An assignment must belong to a section"],
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    // Grading
    totalPoints: {
      type: Number,
      default: 100,
    },
    passingScore: {
      type: Number,
      default: 70,
    },
    // Submission settings
    allowedFileTypes: [String], // e.g., ["pdf", "docx", "jpg"]
    maxFileSize: {
      type: Number, // in MB
      default: 10,
    },
    maxSubmissions: {
      type: Number,
      default: 1,
    },
    // Deadlines
    dueDate: {
      type: Date,
    },
    lateSubmissionAllowed: {
      type: Boolean,
      default: true,
    },
    latePenalty: {
      type: Number, // percentage penalty per day
      default: 10,
    },
    // Rubric
    rubric: [
      {
        criterion: String,
        description: String,
        points: Number,
      },
    ],
    // Peer review
    peerReviewEnabled: {
      type: Boolean,
      default: false,
    },
    peerReviewCount: {
      type: Number, // number of peers to review
      default: 2,
    },
  },
  { timestamps: true }
);

AssignmentSchema.index({ section: 1, order: 1 });

const Assignment = models.Assignment || model("Assignment", AssignmentSchema);

export default Assignment;
