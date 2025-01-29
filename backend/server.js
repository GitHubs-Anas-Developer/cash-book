const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dbConnect = require("./db/dbConnect");

const authRoutes = require("./routes/userRoutes");
const cashbookRoutes = require("./routes/cashbookRoutes");
const notebookRoutes = require("./routes/notebookRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const spinRoutes = require("./routes/spinWinRoutes");
const protectRoute = require("./middleware/protectRoute");
// Load environment variables
dotenv.config();

// Connect to the database
dbConnect();

// Initialize the app
const app = express();

// Middleware for parsing JSON requests
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());



app.use(
  express.urlencoded({
    urlencoded: true,
  })
);

app.get("/authCheck", protectRoute, (req, res) => {
  res.status(200).json({ message: "You have access!", user: req.user });
});

// Route handlers
app.use("/api/auth", authRoutes);
app.use("/api/cashbook", cashbookRoutes);
app.use("/api/notebook", notebookRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/spin", spinRoutes);

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
