const mongoose = require("mongoose");

const surplusSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  foodItem: { type: String, required: true },     // e.g., Rice, Curry
  isVeg: { type: Boolean, required: true },       // true = Veg, false = Non-Veg
  quantity: { type: Number, required: true },     // No. of meals
  loggedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  loggedAt: { type: Date, default: Date.now },

  // Food safety check
  isSafeToEat: { type: Boolean, default: null },
  checkedAt: { type: Date },
  distributedTo: { type: String }, // "students/staff" or "ngo"
  distributedToId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  claimToken: { type: String, unique: true },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  isClaimed: { type: Boolean, default: false },
  claimedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Surplus", surplusSchema);
