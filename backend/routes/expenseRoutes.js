const express = require("express");
const protectRoute = require("../middleware/protectRoute");
const {
  createExpense,
  getExpenseList,
  getSingleExpense,
  getSingleExpensesView,
  updateExpense,
  addExpense,
  deleteExpense,
  deleteExpenses,
} = require("../controllers/expenseController");

const router = express.Router();

router.post("/create", protectRoute, createExpense);
router.get("/", protectRoute, getExpenseList);
router.get("/single/:id", protectRoute, getSingleExpense);
router.get("/expenses/single/view/:id", protectRoute, getSingleExpensesView);
router.put("/expenses/:id", protectRoute, updateExpense);
router.post("/expenses/add/:id", protectRoute, addExpense);
router.delete("/:id", protectRoute, deleteExpense);
router.delete("/expenses/:id", protectRoute, deleteExpenses);

module.exports = router;
