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

    const { users, amount, totalAmount, category } = req.body;

    // Validate required fields
    if (!totalAmount) {
      return res.status(400).json({ message: "totalAmount is required" });
    }

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: "Users array cannot be empty" });
    }

    // Validate individual user amounts if necessary
    users.forEach((user) => {
      if (user.amount <= 0) {
        return res.status(400).json({
          message: `Amount for user ${user.name} should be greater than zero.`,
        });
      }
    });

    // Create the new SpinWin entry
    const newEntry = new SpinWin({
      userId,
      users,
      amount,
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
      data: participants,
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
      data: spin,
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
    const { id } = req.params; // Retrieve the spin ID from the route parameter

    const { name, amount } = req.body; // Retrieve name and amount from the request body
    // Validate if both name and amount are provided
    if (!name || !amount) {
      return res
        .status(400)
        .json({ message: "Please provide both name and amount" });
    }

    // Find the specific SpinWin document by its ID
    const spin = await SpinWin.findById(id); // findById automatically converts to ObjectId

    // Check if the SpinWin document exists
    if (!spin) {
      return res.status(404).json({ message: "Spin not found" });
    }

    // Push the new user to the users array in the SpinWin document
    spin.users.push({
      name,
      amount,
    });

    // Save the updated SpinWin document
    await spin.save();

    // Return a success response
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
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

module.exports = {
  createUser,
  getSpinParticipants,
  getSpinSingleParticipants,
  addUser,
  getWinUser,
};
