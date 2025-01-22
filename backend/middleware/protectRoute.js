const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(400).json({
        message: "Unauthorized: No token provided",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(400).json({
        message: "Unauthorized: Invalid token",
      });
    }
    const user = await User.findOne({ _id: decode.userId }).select("-password");

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = protectRoute;
