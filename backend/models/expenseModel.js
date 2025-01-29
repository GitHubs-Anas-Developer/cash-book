// /models/Expense.js
const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: String,
      trim: true,
    },
    expenses: [
      {
        title: {
          type: String,
        },
        amount: {
          type: Number,
          min: 0,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expense", ExpenseSchema);
