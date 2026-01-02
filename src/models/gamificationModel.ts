import { Schema, model, models } from "mongoose";

// User Gamification Profile
const UserGamificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // Points and XP
    totalPoints: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    currentLevelPoints: {
      type: Number,
      default: 0,
    },
    pointsToNextLevel: {
      type: Number,
      default: 100,
    },
    // Streaks
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastActivityDate: {
      type: Date,
    },
    // Achievements
    badges: [
      {
        badgeId: String,
        earnedAt: Date,
        progress: Number, // for progressive badges
      },
    ],
    // Statistics
    totalLecturesCompleted: {
      type: Number,
      default: 0,
    },
    totalQuizzesPassed: {
      type: Number,
      default: 0,
    },
    totalCoursesCompleted: {
      type: Number,
      default: 0,
    },
    totalStudyTimeMinutes: {
      type: Number,
      default: 0,
    },
    // Milestones
    milestones: [
      {
        type: String,
        achievedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

// Point Transaction History
const PointTransactionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "lecture_completed",
        "quiz_passed",
        "course_completed",
        "daily_login",
        "streak_bonus",
        "first_quiz_perfect",
        "challenge_completed",
        "milestone_reached",
      ],
      required: true,
    },
    description: {
      type: String,
    },
    metadata: {
      courseId: String,
      lectureId: String,
      quizId: String,
    },
  },
  { timestamps: true }
);

// Badge Definitions
const BadgeDefinitionSchema = new Schema({
  badgeId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  icon: {
    type: String, // emoji or icon class
  },
  category: {
    type: String,
    enum: ["learning", "achievement", "streak", "social", "special"],
    default: "achievement",
  },
  rarity: {
    type: String,
    enum: ["common", "rare", "epic", "legendary"],
    default: "common",
  },
  criteria: {
    type: String, // JSON string describing unlock criteria
  },
  points: {
    type: Number,
    default: 0,
  },
});

// Leaderboard
const LeaderboardSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["global", "course", "weekly", "monthly"],
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    period: {
      start: Date,
      end: Date,
    },
    entries: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        rank: Number,
        points: Number,
        coursesCompleted: Number,
        quizzesPassed: Number,
      },
    ],
  },
  { timestamps: true }
);

// Daily Challenge
const DailyChallengeSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    challenges: [
      {
        type: {
          type: String,
          enum: [
            "complete_lecture",
            "pass_quiz",
            "study_time",
            "perfect_quiz",
            "complete_section",
          ],
        },
        target: Number,
        points: Number,
        description: String,
      },
    ],
  },
  { timestamps: true }
);

// User Challenge Progress
const UserChallengeProgressSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    challenges: [
      {
        type: String,
        completed: Boolean,
        progress: Number,
        target: Number,
      },
    ],
  },
  { timestamps: true }
);

UserChallengeProgressSchema.index({ user: 1, date: 1 }, { unique: true });
PointTransactionSchema.index({ user: 1, createdAt: -1 });
LeaderboardSchema.index({ type: 1, "period.start": 1 });

const UserGamification =
  models.UserGamification || model("UserGamification", UserGamificationSchema);
const PointTransaction =
  models.PointTransaction || model("PointTransaction", PointTransactionSchema);
const BadgeDefinition =
  models.BadgeDefinition || model("BadgeDefinition", BadgeDefinitionSchema);
const Leaderboard =
  models.Leaderboard || model("Leaderboard", LeaderboardSchema);
const DailyChallenge =
  models.DailyChallenge || model("DailyChallenge", DailyChallengeSchema);
const UserChallengeProgress =
  models.UserChallengeProgress ||
  model("UserChallengeProgress", UserChallengeProgressSchema);

export {
  UserGamification,
  PointTransaction,
  BadgeDefinition,
  Leaderboard,
  DailyChallenge,
  UserChallengeProgress,
};
