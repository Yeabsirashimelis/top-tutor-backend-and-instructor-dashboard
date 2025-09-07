import { Schema, model, models } from "mongoose";

const PaymentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // buyer
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    collection: { type: Schema.Types.ObjectId, ref: "Collection" },

    amount: { type: Number, required: true },

    instructor: { type: Schema.Types.ObjectId, ref: "User", required: true }, // course owner

    receiptImage: {
      type: String, // Cloudinary/Mux/local URL
      required: [true, "Payment must include a receipt screenshot"],
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", // admin needs to verify screenshot
    },

    transactionId: String, // optional: bank ref number or internal ref
  },
  { timestamps: true }
);

const Payment = models.Payment || model("Payment", PaymentSchema);
export default Payment;
