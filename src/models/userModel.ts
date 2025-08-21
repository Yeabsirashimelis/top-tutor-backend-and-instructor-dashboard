import { model, models, Schema } from "mongoose";
import { unique } from "next/dist/build/utils";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [40, "A course name must have less or equal 40 character"],
      minlength: [5, "A course name must have more or equal 10 characters"],
    },
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: String,
    role: {
      enum: {
        values: ["STUDENT", "INSTRUCTOR", "ADMIN"],
      },
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
