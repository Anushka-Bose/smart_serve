// models/Leaderboard.js
const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pointsChange: { type: Number, required: true }, // +10, -5
  reason: { type: String, required: true },       // e.g. "Picked up food", "Did not collect"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Leaderboard", leaderboardSchema);
