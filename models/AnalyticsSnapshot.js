const mongoose = require('mongoose');

const analyticsSnapshotSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  totalListings: Number,
  totalPickups: Number,
  totalUsers: Number,
  averagePoints: Number
});

module.exports = mongoose.model('AnalyticsSnapshot', analyticsSnapshotSchema);
