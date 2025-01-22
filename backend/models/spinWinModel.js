const mongoose = require("mongoose");

const SpinWinSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensure the spin is linked to a user
    },

    category: {
      type: String,
      required: true,
    },
    users: [
      {
        name: {
          type: String,
          required: true, // Name of the participant
        },
        amount: {
          type: Number,
          required: true, // Spin amount for the participant
          default: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    winners: [
      {
        name: {
          type: String,
        },
        amount: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const SpinWin = mongoose.model("SpinWin", SpinWinSchema);

module.exports = SpinWin;
