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

module.exports = router;
