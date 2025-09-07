import { Schema, model, models } from "mongoose";

const QuizSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "A quiz must have a title"],
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
    questions: [
      {
        questionText: {
          type: String,
          required: true,
        },
        options: [
          {
            text: { type: String, required: true },
            isCorrect: { type: Boolean, default: false },
          },
        ],
        explanation: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

// Ensure quiz order is unique per section
QuizSchema.index({ order: 1, section: 1 }, { unique: true });

const Quiz = models.Quiz || model("Quiz", QuizSchema);

export default Quiz;
