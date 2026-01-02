import { Schema, model, models } from "mongoose";

const QuizAnalyticsSchema = new Schema(
  {
    quiz: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Attempt details
    attemptNumber: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    // Time tracking
    timeSpent: {
      type: Number, // seconds
      required: true,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    completedAt: {
      type: Date,
      required: true,
    },
    // Question-level analytics
    questionResults: [
      {
        questionIndex: Number,
        questionText: String,
        questionType: String,
        isCorrect: Boolean,
        userAnswer: Schema.Types.Mixed,
        correctAnswer: Schema.Types.Mixed,
        timeSpent: Number, // seconds spent on this question
        points: Number,
        earnedPoints: Number,
      },
    ],
    // Behavioral metrics
    questionsSkipped: {
      type: Number,
      default: 0,
    },
    questionsRevisited: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Indexes for analytics queries
QuizAnalyticsSchema.index({ quiz: 1, createdAt: -1 });
QuizAnalyticsSchema.index({ course: 1, createdAt: -1 });
QuizAnalyticsSchema.index({ user: 1, quiz: 1 });

const QuizAnalytics = models.QuizAnalytics || model("QuizAnalytics", QuizAnalyticsSchema);

export default QuizAnalytics;
