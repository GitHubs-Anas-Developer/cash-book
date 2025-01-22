const mongoose = require("mongoose");

const NotebookSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to a User model
    required: true,
  },
  notes: [
    {
      title: {
        type: String,
      },
      content: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Notebook = mongoose.model("Notebook", NotebookSchema);

module.exports = Notebook;
