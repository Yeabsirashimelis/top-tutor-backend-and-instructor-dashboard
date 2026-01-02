import { Schema, model, models } from "mongoose";

const QuestionBankSchema = new Schema(
  {
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    category: {
      type: String,
      required: true,
    },
    tags: [String],
    questionText: {
      type: String,
      required: true,
    },
    questionType: {
      type: String,
      enum: ["multiple-choice", "true-false", "multiple-select", "fill-in-blank"],
      required: true,
    },
    options: [
      {
        text: { type: String, required: true },
        isCorrect: { type: Boolean, default: false },
      },
    ],
    correctAnswer: {
      type: String,
    },
    caseSensitive: {
      type: Boolean,
      default: false,
    },
    explanation: {
      type: String,
    },
    points: {
      type: Number,
      default: 1,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    timesUsed: {
      type: Number,
      default: 0,
    },
    averageSuccessRate: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Indexes
QuestionBankSchema.index({ instructor: 1, category: 1 });
QuestionBankSchema.index({ course: 1 });
QuestionBankSchema.index({ tags: 1 });

const QuestionBank = models.QuestionBank || model("QuestionBank", QuestionBankSchema);

export default QuestionBank;
