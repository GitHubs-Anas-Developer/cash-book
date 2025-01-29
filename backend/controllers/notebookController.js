const Notebook = require("../models/notebook");

const createNotebook = async (req, res) => {
  try {
    const userId = req.user._id;

    // Ensure the user is authenticated
    if (!userId) {
      return res.status(400).json({
        message: "Unauthorized",
      });
    }

    // Destructure incoming data from request body
    const { notebook, notes } = req.body;

    // Create a new notebook instance
    const newNotebook = new Notebook({
      heading: notebook.heading,
      description: notebook.description,
      notes: notes.map((note) => ({
        title: note.title,
        content: note.content,
      })),
      userId, // Include userId in the notebook to associate with the user
    });

    // Save the new notebook to the database
    await newNotebook.save();

    // Send the success response
    res.status(201).json({
      message: "Notebook created successfully",
      newNotebook,
    });
  } catch (error) {
    console.error(error); // For logging errors to the server console
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

const getNotebooks = async (req, res) => {
  try {
    const userId = req.user._id;

    // Ensure the user is authenticated
    if (!userId) {
      return res.status(400).json({
        message: "Unauthorized",
      });
    }

    // Fetch notebooks for the authenticated user
    const notebooks = await Notebook.find({ userId: userId }); // Assuming the field is 'user', not 'userId'

    // Check if notebooks are found
    if (notebooks.length === 0) {
      return res.status(404).json({ message: "No notebooks found" });
    }

    // Send the found notebooks
    res.status(200).json({
      notebooks,
    });
  } catch (error) {
    console.error(error); // For logging the error
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};
const getNotebookById = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is attached to the request (via authentication middleware)
    const { id } = req.params; // Extract notebook ID from the URL parameters

    if (!userId) {
      return res.status(400).json({
        message: "Unauthorized", // User must be authenticated
      });
    }

    // Find the notebook by ID and ensure it's owned by the authenticated user
    const notebook = await Notebook.findOne({ _id: id, userId: userId });

    if (!notebook) {
      return res.status(404).json({
        message: "Notebook not found",
      });
    }

    // Return the found notebook
    return res.status(200).json({
      notebook,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
const updateNotebook = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({
        message: "Unauthorized",
      });
    }

    const { id } = req.params; // Get notebook ID from URL parameters
    const { heading, description, notes } = req.body; // Get updated data from the request body

    // Ensure required fields are provided
    if (!heading) {
      return res.status(400).json({
        message: "Heading is required",
      });
    }

    // Find the notebook by its ID and the userId to ensure the user can only update their own notebook
    const notebook = await Notebook.findOne({ _id: id, userId: userId });

    if (!notebook) {
      return res.status(404).json({
        message:
          "Notebook not found or you are not authorized to update this notebook",
      });
    }

    // Update the notebook with the new heading and description
    notebook.heading = heading;
    notebook.description = description;

    // Update the notes if provided
    if (Array.isArray(notes)) {
      notebook.notes.forEach((item, index) => {
        if (notes[index]) {
          item.title = notes[index].title || item.title; // Update the title if provided
          item.content = notes[index].content || item.content; // Update the content if provided
        }
      });
    }

    // Save the updated notebook
    await notebook.save();

    return res.status(200).json({
      message: "Notebook updated successfully",
      notebook,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteNotebook = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({
        message: "Unauthorized", // User must be authenticated
      });
    }
    const { id } = req.params;

    const notebook = await Notebook.findOne({ _id: id });

    if (!notebook) {
      return res.status(404).json({ message: "Notebook not found" });
    }

    if (notebook.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    await Notebook.findByIdAndDelete(id);
    return res.status(200).json({ message: "Notebook successfully deleted" });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createNotebook,
  getNotebooks,
  getNotebookById,
  updateNotebook,
  deleteNotebook,
};
