import { Schema, model, models } from "mongoose";

const QuestionSchema = new Schema({
  questionText: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    enum: ["multiple-choice", "true-false", "multiple-select", "fill-in-blank"],
    default: "multiple-choice",
  },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, default: false },
    },
  ],
  // For fill-in-blank questions
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
});

const QuizSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "A quiz must have a title"],
    },
    description: {
      type: String,
    },
    section: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      required: [true, "A quiz must belong to a section"],
    },
    order: {
      type: Number,
      required: [true, "A quiz must have an order"],
    },
    questions: [QuestionSchema],
    // New fields
    passingScore: {
      type: Number,
      default: 70,
      min: 0,
      max: 100,
    },
    timeLimit: {
      type: Number, // in minutes, 0 or null means no limit
      default: 0,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    randomizeQuestions: {
      type: Boolean,
      default: false,
    },
    randomizeOptions: {
      type: Boolean,
      default: false,
    },
    showCorrectAnswers: {
      type: Boolean,
      default: true,
    },
    maxAttempts: {
      type: Number,
      default: 0, // 0 means unlimited
    },
    requiredToPass: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Ensure quiz order is unique per section
QuizSchema.index({ order: 1, section: 1 }, { unique: true });

const Quiz = models.Quiz || model("Quiz", QuizSchema);

export default Quiz;
