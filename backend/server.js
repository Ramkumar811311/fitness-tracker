const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const cors = require("cors");
const path = require("path");

// Load environment variables
dotenv.config();

console.log(
  "EMAIL_USER length:",
  process.env.EMAIL_USER?.length
);

console.log(
  "EMAIL_PASS length:",
  process.env.EMAIL_PASS?.length
);

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Enable CORS to allow requests from frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Root route (for health check)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API routes
app.use("/api/users", userRoutes);       // Login, Register, Profile
app.use("/api/workouts", workoutRoutes); // Workout tracking
app.use("/api/nutrition", nutritionRoutes); // Nutrition info
app.use("/api/exercises", exerciseRoutes); // Exercise database

// Serve static files from /uploads if needed
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
