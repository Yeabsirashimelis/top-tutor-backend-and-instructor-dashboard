import { Schema, model, models } from "mongoose";

const SubmissionFileSchema = new Schema({
  filename: String,
  url: String,
  fileType: String,
  fileSize: Number, // in bytes
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const RubricScoreSchema = new Schema({
  criterion: String,
  pointsEarned: Number,
  feedback: String,
});

const PeerReviewSchema = new Schema({
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  score: Number,
  feedback: String,
  rubricScores: [RubricScoreSchema],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const AssignmentSubmissionSchema = new Schema(
  {
    assignment: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
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
    // Submission details
    submissionNumber: {
      type: Number,
      default: 1,
    },
    files: [SubmissionFileSchema],
    textContent: {
      type: String,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    isLate: {
      type: Boolean,
      default: false,
    },
    // Grading
    status: {
      type: String,
      enum: ["submitted", "grading", "graded", "returned"],
      default: "submitted",
    },
    score: {
      type: Number,
    },
    grade: {
      type: String, // A, B, C, etc.
    },
    rubricScores: [RubricScoreSchema],
    instructorFeedback: {
      type: String,
    },
    gradedAt: {
      type: Date,
    },
    gradedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // Peer reviews
    peerReviews: [PeerReviewSchema],
    peerReviewScore: {
      type: Number,
    },
    // Assigned peer reviews (submissions this student needs to review)
    assignedPeerReviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "AssignmentSubmission",
      },
    ],
  },
  { timestamps: true }
);

AssignmentSubmissionSchema.index({ assignment: 1, student: 1 });
AssignmentSubmissionSchema.index({ course: 1, status: 1 });

const AssignmentSubmission =
  models.AssignmentSubmission || model("AssignmentSubmission", AssignmentSubmissionSchema);

export default AssignmentSubmission;
