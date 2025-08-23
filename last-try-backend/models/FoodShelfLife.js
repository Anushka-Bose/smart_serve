const mongoose = require("mongoose");

const foodShelfLifeSchema = new mongoose.Schema({
  foodItem: { type: String, required: true },
  foodCategory: { type: String, required: true }, // GRAINS, MEAT, VEGETABLES, DAIRY, etc.
  temperature: { type: Number, required: true }, // in Celsius
  humidity: { type: Number, required: true }, // in percentage
  predictedShelfLife: { type: Number, required: true }, // in hours
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  isSafeToEat: { type: Boolean, default: true },
  remainingHours: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  notes: { type: String },
  status: { 
    type: String, 
    enum: ['active', 'expired', 'consumed'], 
    default: 'active' 
  }
}, { timestamps: true });

// Index for efficient queries
foodShelfLifeSchema.index({ expiresAt: 1, status: 1 });
foodShelfLifeSchema.index({ createdAt: -1 });

module.exports = mongoose.model("FoodShelfLife", foodShelfLifeSchema); 