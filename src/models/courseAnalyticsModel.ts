import { Schema, model, models } from "mongoose";

// Course Analytics Snapshot (aggregated daily)
const CourseAnalyticsSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    // Enrollment metrics
    totalEnrollments: {
      type: Number,
      default: 0,
    },
    newEnrollments: {
      type: Number,
      default: 0,
    },
    activeStudents: {
      type: Number,
      default: 0,
    },
    completedStudents: {
      type: Number,
      default: 0,
    },
    // Engagement metrics
    averageCompletionRate: {
      type: Number,
      default: 0,
    },
    averageWatchTime: {
      type: Number,
      default: 0,
    },
    totalWatchTime: {
      type: Number,
      default: 0,
    },
    // Revenue metrics
    revenue: {
      type: Number,
      default: 0,
    },
    refunds: {
      type: Number,
      default: 0,
    },
    netRevenue: {
      type: Number,
      default: 0,
    },
    // Rating metrics
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    newReviews: {
      type: Number,
      default: 0,
    },
    // Content metrics
    mostWatchedLecture: {
      lectureId: Schema.Types.ObjectId,
      views: Number,
    },
    leastWatchedLecture: {
      lectureId: Schema.Types.ObjectId,
      views: Number,
    },
    averageQuizScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Lecture Analytics (per lecture)
const LectureAnalyticsSchema = new Schema(
  {
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
    // View metrics
    totalViews: {
      type: Number,
      default: 0,
    },
    uniqueViews: {
      type: Number,
      default: 0,
    },
    completions: {
      type: Number,
      default: 0,
    },
    completionRate: {
      type: Number,
      default: 0,
    },
    // Engagement metrics
    averageWatchTime: {
      type: Number,
      default: 0,
    },
    averageWatchPercentage: {
      type: Number,
      default: 0,
    },
    replayCount: {
      type: Number,
      default: 0,
    },
    bookmarkCount: {
      type: Number,
      default: 0,
    },
    // Drop-off points (timestamps where students stop)
    dropOffPoints: [
      {
        timestamp: Number,
        count: Number,
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Quiz Analytics (per quiz)
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
    // Attempt metrics
    totalAttempts: {
      type: Number,
      default: 0,
    },
    uniqueStudents: {
      type: Number,
      default: 0,
    },
    passedAttempts: {
      type: Number,
      default: 0,
    },
    passRate: {
      type: Number,
      default: 0,
    },
    // Score metrics
    averageScore: {
      type: Number,
      default: 0,
    },
    highestScore: {
      type: Number,
      default: 0,
    },
    lowestScore: {
      type: Number,
      default: 0,
    },
    // Time metrics
    averageTime: {
      type: Number,
      default: 0,
    },
    // Question analytics
    questionStats: [
      {
        questionIndex: Number,
        correctCount: Number,
        incorrectCount: Number,
        averageTime: Number,
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Student Engagement Score (per student per course)
const StudentEngagementSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    // Engagement metrics
    engagementScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastActive: {
      type: Date,
    },
    totalWatchTime: {
      type: Number,
      default: 0,
    },
    completionRate: {
      type: Number,
      default: 0,
    },
    quizzesPassed: {
      type: Number,
      default: 0,
    },
    notesCount: {
      type: Number,
      default: 0,
    },
    discussionPosts: {
      type: Number,
      default: 0,
    },
    // Risk indicators
    atRisk: {
      type: Boolean,
      default: false,
    },
    daysInactive: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

CourseAnalyticsSchema.index({ course: 1, date: -1 });
CourseAnalyticsSchema.index({ instructor: 1, date: -1 });
LectureAnalyticsSchema.index({ lecture: 1 });
LectureAnalyticsSchema.index({ course: 1 });
QuizAnalyticsSchema.index({ quiz: 1 });
QuizAnalyticsSchema.index({ course: 1 });
StudentEngagementSchema.index({ student: 1, course: 1 }, { unique: true });
StudentEngagementSchema.index({ course: 1, engagementScore: -1 });

const CourseAnalytics =
  models.CourseAnalytics || model("CourseAnalytics", CourseAnalyticsSchema);
const LectureAnalytics =
  models.LectureAnalytics || model("LectureAnalytics", LectureAnalyticsSchema);
const QuizAnalytics =
  models.QuizAnalytics || model("QuizAnalytics", QuizAnalyticsSchema);
const StudentEngagement =
  models.StudentEngagement || model("StudentEngagement", StudentEngagementSchema);

export { CourseAnalytics, LectureAnalytics, QuizAnalytics, StudentEngagement };
