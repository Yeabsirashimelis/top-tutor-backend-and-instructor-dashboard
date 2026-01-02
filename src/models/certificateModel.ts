import { Schema, model, models } from "mongoose";

const CertificateSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
    },
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    completionDate: {
      type: Date,
      required: true,
    },
    grade: {
      type: String, // e.g., "A+", "Passed", "98%"
    },
    finalScore: {
      type: Number,
    },
    pdfUrl: {
      type: String, // URL to generated PDF certificate
    },
    verificationCode: {
      type: String,
      unique: true,
    },
    // Certificate metadata
    instructorName: String,
    courseDuration: Number, // in hours
    skillsAcquired: [String],
  },
  { timestamps: true }
);

CertificateSchema.index({ user: 1, course: 1 }, { unique: true });
CertificateSchema.index({ certificateNumber: 1 });
CertificateSchema.index({ verificationCode: 1 });

const Certificate = models.Certificate || model("Certificate", CertificateSchema);

export default Certificate;
