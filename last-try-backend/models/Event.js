const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  eventTime: { type: String, required: true },   // e.g., "10:30"
  description: { type: String },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Reference to surplus entries
  surplusEntries: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Surplus" }
  ],

  reminderSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
