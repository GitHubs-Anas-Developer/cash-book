const express = require("express");
const protectRoute = require("../middleware/protectRoute");
const {
  createUser,
  getSpinParticipants,
  getSpinSingleParticipants,
  addUser,
  getWinUser,
  deleteSpinGroup,
  updateSpinGroup,
  deleteSpinGroupUser,
} = require("../controllers/spinWinController");

const router = express.Router();

router.post("/create", protectRoute, createUser);
router.get("/", protectRoute, getSpinParticipants);
router.get("/single/:id", protectRoute, getSpinSingleParticipants);
router.post("/single/participants/add/:id", protectRoute, addUser);
router.get("/winner/:id", protectRoute, getWinUser);
router.delete("/spinGroup/:id", protectRoute, deleteSpinGroup);
router.put("/SpinGroup/:id", protectRoute, updateSpinGroup);
router.delete("/spinGroupUser/:spinId/:spinGroupUserId", protectRoute, deleteSpinGroupUser);

module.exports = router;
