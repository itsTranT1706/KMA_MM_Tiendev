const express = require("express");
const { ActivityLog } = require("../models");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const logs = await ActivityLog.findAll();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching logs" });
  }
});

module.exports = router;
