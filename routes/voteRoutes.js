const express = require("express");
const router = express.Router();

const Candidate = require("../models/Candidate");
const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");


router.post("/:candidateId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const candidateId = req.params.candidateId;

    
    const user = await User.findById(userId);

    
    if (user.hasVoted) {
      return res.status(400).json({
        message: "You have already voted"
      });
    }

    
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found"
      });
    }

    
    candidate.votes += 1;
    await candidate.save();

    
    user.hasVoted = true;
    await user.save();

    res.json({
      message: "Vote cast successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;
