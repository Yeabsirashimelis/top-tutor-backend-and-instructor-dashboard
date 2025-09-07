import { Schema, model, models } from "mongoose";

const PayoutSchema = new Schema(
  {
    instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "paid"],
      default: "pending",
    },
    method: { type: String }, // "bank" | "paypal" etc.
    processedAt: Date,
  },
  { timestamps: true }
);

const Payout = models.Payout || model("Payout", PayoutSchema);
export default Payout;
