const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodListing' },
  pickedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['student', 'staff', 'NGO'], default: 'student' },
  preferences: {
    foodTypes: [{ type: String }],
    cuisines: [{ type: String }],
    portionSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' }
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
  },
  pickupHistory: [pickupSchema],
  points: { type: Number, default: 0 },
  fcmToken: { type: String }
}, { timestamps: true });

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
