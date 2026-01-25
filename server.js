// Express import
const express = require("express");

// CORS import
const cors = require("cors");

// Mongoose import
const mongoose = require("mongoose");

// dotenv import
require("dotenv").config();

// Express app create
const app = express();

// Port
const PORT = process.env.PORT || 5000;

// =========================
// Global Middleware
// =========================
app.use(express.json());
app.use(cors()); // 👈 CORS ENABLED (IMPORTANT)

// =========================
// Routes imports
// =========================
const authRoutes = require("./routes/authRoutes");
const voteRoutes = require("./routes/voteRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const resultRoutes = require("./routes/resultRoutes");


const authMiddleware = require("./middleware/authMiddleware");

app.use("/api/auth", authRoutes);
app.use("/api/vote", voteRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/results", resultRoutes);


app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user
  });
});



const Candidate = require("./models/Candidate");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected successfully");


    const count = await Candidate.countDocuments();

    if (count === 0) {
      await Candidate.insertMany([
        { name: "Candidate A", party: "Party Alpha" },
        { name: "Candidate B", party: "Party Beta" },
        { name: "Candidate C", party: "Party Gamma" },
      ]);

      console.log("Default candidates added");
    }
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });


app.get("/", (req, res) => {
  res.send("Online Voting System Backend is Running");
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
