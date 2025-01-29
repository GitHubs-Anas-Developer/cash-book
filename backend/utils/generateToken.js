const jwt = require("jsonwebtoken");

const generateToken = (userId, res) => {
  // Generate a JWT with a 15-day expiration
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d", // JWT token expiration (15 days)
  });

  // Set the cookie expiration to match the token's expiration (15 days)
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds (corrected)
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production", // Secure cookies in production
  });
};


module.exports = generateToken;
