import { Schema, model, models } from "mongoose";

const WishlistSchema = new Schema(
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
  },
  { timestamps: true }
);

// Ensure a user can only have one wishlist entry per course
WishlistSchema.index({ user: 1, course: 1 }, { unique: true });

const Wishlist = models.Wishlist || model("Wishlist", WishlistSchema);

export default Wishlist;
