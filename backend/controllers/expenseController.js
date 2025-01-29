const Expense = require("../models/expenseModel");

const createExpense = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({
        message: "Unauthorized",
      });
    }

    const { expenseCategory, expenses } = req.body;

    console.log(req.body);

    if (
      !expenseCategory.category ||
      !Array.isArray(expenses) ||
      expenses.length === 0
    ) {
      return res.status(400).json({
        message: "Category and expense details are required",
      });
    }

    const newExpense = new Expense({
      category: expenseCategory.category,
      expenses: expenses.map((item) => ({
        title: item.title,
        amount: parseFloat(item.amount),
        date: item.date,
      })),
      userId,
    });
    // Save the expense to the database
    await newExpense.save();

    res.status(201).json({
      message: "Expense created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getExpenseList = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({
        message: "Unauthorized",
      });
    }

    const expenses = await Expense.find({ userId: userId });

    if (expenses.length === 0 || !expenses) {
      return res.status(400).json({
        message: "No expenses found for the user",
      });
    }

    res.status(200).json({
      expenses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
const getSingleExpense = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { id } = req.params;

    // Validate the `id` parameter
    if (!id) {
      return res.status(400).json({
        message: "Expense ID is required",
      });
    }

    // Find the expense by ID
    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    // Check if the expense belongs to the authenticated user
    if (expense.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to view this expense",
      });
    }

    // Calculate total amount from the `expenses` array (if applicable)
    const expenseTotalAmount = expense.expenses.reduce(
      (total, item) => total + item.amount,
      0
    );

    res.status(200).json({
      expense,
      expenseTotalAmount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getSingleExpensesView = async (req, res) => {
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
        message: "Expenses ID is required",
      });
    }

    const expenses = await Expense.findOne({
      userId,
      expenses: {
        $elemMatch: {
          _id: id,
        },
      },
    });

    const expensesOne = expenses.expenses.find(
      (item) => item._id.toString() === id.toString()
    );

    if (!expensesOne) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      expensesOne,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const addExpense = async (req, res) => {
  try {
    const userId = req.user?._id; // Ensure `req.user` is defined.

    // Check if user is authorized
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Destructure and validate request body
    const { title, amount } = req.body;

    if (!title || !amount) {
      return res.status(400).json({
        message: "Both 'title' and 'amount' are required.",
      });
    }

    // Get and validate expense ID from params
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Expense ID is required.",
      });
    }

    // Find the expense record
    const expense = await Expense.findOne({ _id: id, userId }); // Optional: Ensure the expense belongs to the user
    if (!expense) {
      return res.status(404).json({
        message: "Expense not found.",
      });
    }

    // Add the new expense item
    expense.expenses.push({ title, amount });
    await expense.save();

    // Respond with success
    res.status(200).json({
      message: "Expense added successfully.",
      expense,
    });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({
      message: "An error occurred while adding the expense.",
      error: error.message,
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { id } = req.params; // Expense ID
    const { title, amount } = req.body; // Updated fields

    if (!id || !title || !amount) {
      return res.status(400).json({
        message: "Expense ID, title, and amount are required.",
      });
    }

    // Update the specific expense inside the expenses array
    const updatedExpense = await Expense.findOneAndUpdate(
      {
        userId,
        "expenses._id": id, // Match the specific expense in the subdocument
      },
      {
        $set: {
          "expenses.$.title": title, // Update the title
          "expenses.$.amount": amount, // Update the amount
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedExpense) {
      return res.status(404).json({
        message: "Expense not found.",
      });
    }

    return res.status(200).json({
      message: "Expense updated successfully.",
      data: updatedExpense,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const userId = req.user._id; // Extract user ID from the authenticated request

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { id } = req.params; // Get the expense ID from the request parameters

    if (!id) {
      return res.status(400).json({
        message: "Expense ID is required.",
      });
    }

    // Find the expense to ensure it belongs to the user
    const expense = await Expense.findOne({ _id: id, userId });

    if (!expense) {
      return res.status(404).json({
        message:
          "Expense not found or you do not have permission to delete it.",
      });
    }

    // Delete the expense
    await expense.deleteOne();

    res.status(200).json({
      message: "Expense deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

const deleteExpenses = async (req, res) => {
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
        message: "Expenses ID is required.",
      });
    }

    const updatedExpense = await Expense.findOneAndUpdate(
      { userId },
      { $pull: { expenses: { _id: id } } },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({
        message: "Expense not found.",
      });
    }

    return res.status(200).json({
      message: "Expense deleted successfully.",
      updatedExpense,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

module.exports = {
  createExpense,
  getExpenseList,
  getSingleExpense,
  getSingleExpensesView,
  addExpense,
  updateExpense,
  deleteExpense,
  deleteExpenses,
};
