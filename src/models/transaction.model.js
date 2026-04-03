import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Income", "Expense"],
    },
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
const Transaction = mongoose.model("Transaction", transactionSchema);
transactionSchema.index({ createdAt: -1 });
// this will help for getting recent transaction in logn time

export default Transaction;
