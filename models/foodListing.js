const mongoose = require('mongoose');

const foodListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  quantity: { type: Number, required: true },
  freshness: { type: String, enum: ['fresh', 'leftover', 'near-expiry'], required: true },
  availabilityWindow: { type: String, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String },
  expiryTimestamp: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['available', 'picked', 'expired'], default: 'available' },
  lastPointsAwarded: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('foodListing', foodListingSchema);
