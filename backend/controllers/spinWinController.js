const SpinWin = require("../models/spinWinModel");

const createUser = async (req, res) => {
  try {
    // Check if the user is authenticated
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { totalAmount, category } = req.body;

    // Validate required fields
    if (!totalAmount) {
      return res.status(400).json({ message: "totalAmount is required" });
    }

    // Create the new SpinWin entry
    const newEntry = new SpinWin({
      userId,
      totalAmount,
      category,
    });

    // Save the entry to the database
    await newEntry.save();

    res.status(201).json({
      message: "Entry created successfully",
      data: newEntry,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getSpinParticipants = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const participants = await SpinWin.find({ userId: userId });

    if (participants.length === 0) {
      return res.status(404).json({
        message: "No participants found for the user",
      });
    }

    res.status(200).json({
      message: "Participants fetched successfully",
      participants,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getSpinSingleParticipants = async (req, res) => {
  try {
    const userId = req.user._id;

    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized - User is not logged in",
      });
    }

    const spin = await SpinWin.find({ userId: userId, _id: id });

    if (!spin) {
      return res.status(404).json({
        message: "Spin not found",
      });
    }

    return res.status(200).json({
      spin,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
const addUser = async (req, res) => {
  try {
    // Step 1: Authenticate user
    const userId = req.user._id; // Assuming the user is authenticated, and req.user is populated by middleware
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Step 2: Get the SpinWin ID from params
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Spin ID is required" });
    }

    // Step 3: Extract name and amount from the request body
    const { name, amount } = req.body;

    if (!name || !amount) {
      return res
        .status(400)
        .json({ message: "Please provide both name and amount" });
    }

    // Step 4: Find the SpinWin document that matches the ID and user
    const spin = await SpinWin.findOne({ _id: id, userId });
    if (!spin) {
      return res
        .status(404)
        .json({ message: "Spin not found or unauthorized" });
    }

    console.log("spin", spin);

    // Step 5: Add a new user to the SpinWin's users array
    spin.users.push({
      name,
      amount: parseInt(amount),
    });

    // Save the updated SpinWin document
    await spin.save();

    // Step 6: Respond with success
    return res.status(201).json({
      message: "User added successfully",
      spin,
    });
  } catch (error) {
    // Step 7: Handle server errors
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getWinUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const winners = await SpinWin.findOne({ userId: userId });
    await winners.winners.push(id);
    winners.save();

    // Find the winner based on the 'userId' (from the logged-in user) and 'id' from the URL params
    const winner = await SpinWin.findOne({ userId: userId }).populate("users"); // Populate all users first
    const totalAmount = winner.totalAmount;

    if (!winner) {
      return res.status(404).json({
        message: "Winner not found",
      });
    }

    // Find the specific user from the populated 'users' array
    const winnerUser = winner.users.find((user) => user._id.toString() === id);

    if (!winnerUser) {
      return res.status(404).json({
        message: "User not found in the winner's list",
      });
    }
    // Return the winner and the specific user data
    return res.status(200).json({
      totalAmount,
      winnerUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const deleteSpinGroup = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Spin Group ID is required.",
      });
    }

    const spinGroup = await SpinWin.findOne({ _id: id, userId });

    if (!spinGroup) {
      return res.status(404).json({
        message:
          "Spin Group not found or you don't have permission to delete this group.",
      });
    }

    await spinGroup.deleteOne();

    return res.status(200).json({
      message: "Spin Group deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error", // Generic server error message
      error: error.message, // Include the actual error message for debugging
    });
  }
};

const updateSpinGroup = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Spin Group ID is required." });
    }

    const { category, totalAmount, users } = req.body;

    if (!category || !totalAmount) {
      return res
        .status(400)
        .json({ message: "Category and totalAmount are required." });
    }

    const spin = await SpinWin.findOne({ _id: id, userId });

    if (!spin) {
      return res.status(404).json({ message: "Spin Group not found" });
    }

    // Update spin group
    const updatedSpin = await SpinWin.findByIdAndUpdate(
      id,
      {
        category,
        totalAmount,
        users: users.map((user) => ({
          _id: user._id, // Assuming each user has an ID
          name: user.name,
          amount: user.amount,
        })),
      },
      { new: true } // Return the updated document
    );

    res
      .status(200)
      .json({ message: "Spin Group updated successfully", spin: updatedSpin });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message, // Include the actual error message for debugging
    });
  }
};

const deleteSpinGroupUser = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { spinId, spinGroupUserId } = req.params;

    // Find a single SpinWin document (not an array)
    const spinGroup = await SpinWin.findOne({ _id: spinId, userId });

    if (!spinGroup) {
      return res.status(404).json({ message: "Spin group not found" });
    }

    // Filter out the user to be deleted
    spinGroup.users = spinGroup.users.filter(
      (user) => user._id.toString() !== spinGroupUserId
    );

    // Save the updated document
    await spinGroup.save();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  getSpinParticipants,
  getSpinSingleParticipants,
  addUser,
  getWinUser,
  deleteSpinGroup,
  updateSpinGroup,
  deleteSpinGroupUser,
};
