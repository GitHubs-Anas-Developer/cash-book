const express = require("express");
const protectRoute = require("../middleware/protectRoute");
const {
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
} = require("../controllers/cashbookController");

const router = express.Router();

router.post("/create", protectRoute, createCashbookEntry);
router.get("/", protectRoute, getCashbookEntries);
router.get("/single/:id", protectRoute, getCashbookEntryById);
router.put("/:id", protectRoute, updateCashbookEntry);
router.delete("/:id", protectRoute, deleteCashbookEntry);
router.get("/summary", protectRoute, getCashBooksSummary);
router.get("/cash-in", protectRoute, getCashIn);
router.get("/cash-out", protectRoute, getCashOut);
router.get("/cash-received", protectRoute, getReceived);
router.get("/cash-paid", protectRoute, getPaid);

module.exports = router;
