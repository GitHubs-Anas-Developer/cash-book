const express = require("express");
const {
  registerUser,
  loginUser,
  getUser,
  userLogout,
} = require("../controllers/userController");
const protectRoute = require("../middleware/protectRoute");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", userLogout);
router.get("/profile", protectRoute, getUser);

module.exports = router;
