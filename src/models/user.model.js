import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Viewer", "Analyst", "Admin"],
      default: "Admin",
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    isactive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
const User = mongoose.model("User", userSchema);

export default User;
