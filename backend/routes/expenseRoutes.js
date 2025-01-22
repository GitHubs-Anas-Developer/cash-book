const express = require("express");
const protectRoute = require("../middleware/protectRoute");
const {
  createExpense,
  getExpenseList,
  getSingleExpense,
  addExpense,
} = require("../controllers/expenseController");

const router = express.Router();

router.post("/create", protectRoute, createExpense);
router.get("/", protectRoute, getExpenseList);
router.get("/single/:id", protectRoute, getSingleExpense);
router.post("/:id/add", protectRoute, addExpense);

module.exports = router;
