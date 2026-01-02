import { Schema, model, models } from "mongoose";

// Q&A Messages
const QAMessageSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lecture: {
      type: Schema.Types.ObjectId,
      ref: "Lecture",
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "answered", "archived"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high"],
      default: "normal",
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    answeredAt: {
      type: Date,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Direct Messages
const DirectMessageSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
    threadId: {
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

QAMessageSchema.index({ course: 1, status: 1 });
QAMessageSchema.index({ instructor: 1, status: 1 });
QAMessageSchema.index({ student: 1, course: 1 });
DirectMessageSchema.index({ recipient: 1, isRead: 1 });
DirectMessageSchema.index({ sender: 1, recipient: 1 });

const QAMessage = models.QAMessage || model("QAMessage", QAMessageSchema);
const DirectMessage = models.DirectMessage || model("DirectMessage", DirectMessageSchema);

export { QAMessage, DirectMessage };
