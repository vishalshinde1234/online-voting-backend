const express = require("express");
const router = express.Router();

const Candidate = require("../models/Candidate");


const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");



router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (error) {
    console.error("GET CANDIDATES ERROR:", error);
    res.status(500).json({
      message: "Failed to load candidates"
    });
  }
});



router.post(
  "/add",
  authMiddleware,   
  adminMiddleware, 
  async (req, res) => {
    try {
      const { name, party } = req.body;

      if (!name || !party) {
        return res.status(400).json({
          message: "Name and party are required"
        });
      }

      const candidate = new Candidate({
        name,
        party
      });

      await candidate.save();

      res.status(201).json({
        message: "Candidate added successfully",
        candidate
      });

    } catch (error) {
      console.error("ADD CANDIDATE ERROR:", error);
      res.status(500).json({
        message: "Server error"
      });
    }
  }
);

module.exports = router;
