import { Schema, model, models } from "mongoose";

const AnnouncementSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
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
    // Targeting
    targetAudience: {
      type: String,
      enum: ["all", "active", "at-risk", "completed", "new", "custom"],
      default: "all",
    },
    customRecipients: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Scheduling
    scheduledFor: {
      type: Date,
    },
    publishedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "published"],
      default: "draft",
    },
    // Delivery
    sendEmail: {
      type: Boolean,
      default: true,
    },
    sendInApp: {
      type: Boolean,
      default: true,
    },
    // Analytics
    recipients: {
      type: Number,
      default: 0,
    },
    opened: {
      type: Number,
      default: 0,
    },
    clicked: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

AnnouncementSchema.index({ course: 1, createdAt: -1 });
AnnouncementSchema.index({ instructor: 1, status: 1 });

const Announcement = models.Announcement || model("Announcement", AnnouncementSchema);

export default Announcement;
