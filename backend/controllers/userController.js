const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // Email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Check if email is valid
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Check if password is provided
    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullName: fullname,
      email,
      password: hashPassword,
    });

    generateToken(newUser._id, res);

    await newUser.save();

    // Send success response
    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  console.log();

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    generateToken(user._id, res);
    res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const userLogout = (req, res) => {
  try {
    // Clear the JWT token stored in the cookies (if using cookies)
    res.clearCookie("jwt", { httpOnly: true, secure: true });

    // Send a success message to the client
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getUser = async (req, res) => {
  try {
    const userId = req.user._id;
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Use findById for better clarity and correct handling
    const user = await User.findById(userId).select("-password"); // Exclude the password field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user data
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getUser,
  userLogout,
};
