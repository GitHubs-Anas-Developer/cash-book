const express = require("express");
const protectRoute = require("../middleware/protectRoute");
const {
  createUser,
  getSpinParticipants,
  getSpinSingleParticipants,
  addUser,
  getWinUser,
} = require("../controllers/spinWinController");

const router = express.Router();

router.post("/create", protectRoute, createUser);
router.get("/participants", protectRoute, getSpinParticipants);
router.get("/single/participants/:id", protectRoute, getSpinSingleParticipants);
router.post("/single/participants/:id/add", protectRoute, addUser);
router.get("/winner/:id", protectRoute, getWinUser);

module.exports = router;
