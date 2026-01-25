const express = require("express");
const router = express.Router();

const Candidate = require("../models/Candidate");

router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find().select("name party votes");

    res.json({
      results: candidates
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;
