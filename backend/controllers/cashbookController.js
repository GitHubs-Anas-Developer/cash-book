const Cashbooks = require("../models/cashbookModel");

const createCashbookEntry = async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;
    const { transactionType, amount, status, note, name } = req.body;

    let cashIn;
    let cashOut;

    if (transactionType === "cash_in") {
      cashIn = amount;
    } else {
      cashOut = amount;
    }

    // Create the new cashbook entry
    const newEntry = new Cashbooks({
      user: userId,
      name,
      transactionType,
      cash_in: cashIn,
      cash_out: cashOut,
      status,
      note,
    });

    // Save the entry to the database
    await newEntry.save();

    // Return the created entry
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

const getCashbookEntries = async (req, res) => {
  try {
    const userId = req.user._id;
    // Check if the user is authenticated

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const entries = await Cashbooks.find({ user: userId });

    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

const getCashbookEntryById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const entry = await Cashbooks.findOne({ _id: id });
    if (!entry) return res.status(404).json({ message: "Cashbooks not found" });

    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

const updateCashbookEntry = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const { name, amount, status, transactionType } = req.body;

    console.log(req.body);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let entry = await Cashbooks.findById({ _id: id });

    if (!entry) return res.status(404).json({ message: "Cashbooks not found" });

    let cashIn;
    let cashOut;

    if (transactionType === "cash_in") {
      cashIn = amount;
    } else {
      cashOut = amount;
    }

    entry = await Cashbooks.findByIdAndUpdate(
      id,
      {
        name: name,
        cash_in: cashIn,
        cash_out: cashOut,
        status,
      },
      { new: true }
    );

    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

const deleteCashbookEntry = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the cashbook entry by ID
    const entry = await Cashbooks.findOne({ _id: id });

    if (!entry) {
      return res.status(404).json({ message: "Cashbook entry not found" });
    }

    // Check if the logged-in user is the owner of the entry
    if (entry.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Forbidden: You don't have permission to delete this entry",
      });
    }

    await Cashbooks.findByIdAndDelete(id);

    res.status(200).json({ message: "Cashbook entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

const getCashBooksSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const entries = await Cashbooks.find({ user: userId }).select(
      "cash_in cash_out status"
    );

    if (!entries || entries.length === 0) {
      return res.status(404).json({ message: "No entries found" });
    }

    const totalCashIn = entries.reduce(
      (total, entry) => total + entry.cash_in,
      0
    );
    const totalCashOut = entries.reduce(
      (total, entry) => total + entry.cash_out,
      0
    );
    const balance = totalCashIn - totalCashOut;

    res.status(200).json({
      totalCashIn,
      totalCashOut,
      balance,
      totalEntries: entries.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

const getCashIn = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if the user is authenticated
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find pending cashbook entries for the user
    const cashIn = await Cashbooks.find({
      user: userId,
      status: "pending",
      cash_in: { $gt: 1 }, // Filtering where 'cashIn' is less than 1
    }).select("name date cashIn cash_in status transactionType");

    console.log("cashIn", cashIn);

    // If no cashIn entries are found, return a 404 message
    if (!cashIn || cashIn.length === 0) {
      return res.status(404).json({ message: "No pending cash entries found" });
    }

    // Return the found cashIn entries as a response
    return res.status(200).json({ cashIn });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

const getCashOut = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if the user is authenticated
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cashOut = await Cashbooks.find({
      user: userId,
      status: "pending",
      cash_out: { $gt: 1 }, // Filtering where 'cash_out' is greater than 1
    }).select("name date cash_out status transactionType"); // Corrected to select 'cash_out' instead of 'cashIn' or 'cash_in'

    // If no cash out data found
    if (cashOut.length === 0) {
      return res.status(404).json({ message: "No cash out records found" });
    }

    // Return the retrieved cash out data
    return res.status(200).json({ cashOut });
  } catch (error) {
    return res.status(500).json({ message: "Server Error: " + error.message });
  }
};

const getReceived = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cashReceived = await Cashbooks.find({
      user: userId,
      status: "received",
    }).select("-cash_out");

    if (cashReceived.length === 0) {
      return res.status(404).json({
        message: "Cash received not found",
      });
    }

    return res.status(200).json({ cashReceived });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

const getPaid = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cashPaid = await Cashbooks.find({
      user: userId,
      status: "paid",
    }).select("-cash_in");

    if (cashPaid.length === 0) {
      return res.status(404).json({
        message: "Cash paid not found",
      });
    }

    return res.status(200).json({ cashPaid });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

module.exports = {
  createCashbookEntry,
  getCashbookEntries,
  getCashbookEntryById,
  updateCashbookEntry,
  deleteCashbookEntry,
  getCashBooksSummary,
  getCashIn,
  getCashOut,
  getReceived,
  getPaid,
};
