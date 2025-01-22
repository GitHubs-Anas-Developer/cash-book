const Expense = require("../models/expenseModel");

const createExpense = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({
        message: "Unauthorized",
      });
    }

    const { category, expense } = req.body;

    if (!category || !Array.isArray(expense) || expense.length === 0) {
      return res.status(400).json({
        message: "Category and expense details are required",
      });
    }

    const newExpense = new Expense({
      category,
      expenses: expense.map((item) => ({
        title: item.title,
        amount: parseFloat(item.amount),
      })),
      userId,
    });

    console.log("newExpense", newExpense);

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

const addExpense = async (req, res) => {
  try {
    const userId = req.user?._id; // Ensure `req.user` is defined.

    // Check if user is authorized
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. Please log in.",
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

module.exports = {
  createExpense,
  getExpenseList,
  getSingleExpense,
  addExpense,
};
