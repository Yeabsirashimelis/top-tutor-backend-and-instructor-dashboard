import { Schema, model, models } from "mongoose";

const VideoAnalyticsSchema = new Schema(
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
    // Watch session data
    sessionId: {
      type: String,
      required: true,
    },
    watchDuration: {
      type: Number, // seconds watched
      default: 0,
    },
    completionPercentage: {
      type: Number, // 0-100
      default: 0,
    },
    playbackSpeed: {
      type: Number,
      default: 1,
    },
    // Quality metrics
    selectedQuality: {
      type: String,
      default: "auto",
    },
    bufferingEvents: {
      type: Number,
      default: 0,
    },
    averageBufferTime: {
      type: Number, // seconds
      default: 0,
    },
    // Engagement metrics
    pauseCount: {
      type: Number,
      default: 0,
    },
    seekCount: {
      type: Number,
      default: 0,
    },
    rewindCount: {
      type: Number,
      default: 0,
    },
    // Device info
    deviceType: {
      type: String,
      enum: ["desktop", "mobile", "tablet"],
    },
    browser: {
      type: String,
    },
  },
  { timestamps: true }
);

// Indexes for analytics queries
VideoAnalyticsSchema.index({ lecture: 1, createdAt: -1 });
VideoAnalyticsSchema.index({ course: 1, createdAt: -1 });
VideoAnalyticsSchema.index({ user: 1, lecture: 1 });

const VideoAnalytics = models.VideoAnalytics || model("VideoAnalytics", VideoAnalyticsSchema);

export default VideoAnalytics;
