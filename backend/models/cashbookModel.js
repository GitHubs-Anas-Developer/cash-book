const mongoose = require("mongoose");

const CashbookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    transactionType: {
      type: String,
      enum: ["cash_in", "cash_out"],
      required: true,
    },
    cash_in: {
      type: Number,
      required: true,
      default: 0,
    },
    cash_out: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["received", "paid", "pending"],
      default: "pending",
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Cashbooks = mongoose.model("Cashbooks", CashbookSchema);

module.exports = Cashbooks;
