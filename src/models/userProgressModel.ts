import { Schema, model, models } from "mongoose";

const LectureProgressSchema = new Schema(
  {
    lecture: {
      type: Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
    },
    lastPosition: { type: Number, default: 0 }, // in seconds
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { _id: false }
);

const QuizAttemptSchema = new Schema(
  {
    score: { type: Number, required: true },
    passed: { type: Boolean, default: false },
    completedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const QuizProgressSchema = new Schema(
  {
    quiz: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    attempts: [QuizAttemptSchema], // allow multiple attempts
  },
  { _id: false }
);

const UserCourseProgressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    lecturesProgress: [LectureProgressSchema],
    quizzesProgress: [QuizProgressSchema],
  },
  { timestamps: true }
);

/**
 * Virtual field: overall progress
 * This calculates progress dynamically instead of storing it.
 */
UserCourseProgressSchema.virtual("overallProgress").get(function () {
  const lecturesTotal = this.lecturesProgress.length;
  const lecturesCompleted = this.lecturesProgress.filter(
    (lp) => lp.isCompleted
  ).length;

  // If you want quizzes to count, adjust logic here
  const total = lecturesTotal; // + quizzesTotal, if quizzes count
  const completed = lecturesCompleted; // + quizzesPassed

  if (total === 0) return 0;
  return Math.round((completed / total) * 100); // percentage
});

// Make sure virtuals are included in JSON responses
UserCourseProgressSchema.set("toJSON", { virtuals: true });
UserCourseProgressSchema.set("toObject", { virtuals: true });

const UserCourseProgress =
  models.UserCourseProgress ||
  model("UserCourseProgress", UserCourseProgressSchema);

export default UserCourseProgress;
