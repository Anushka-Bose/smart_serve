const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "staff", "ngo", "canteen/hostel", "organizer", "admin"],
    required: true,
  },
  // Extra fields only for NGO
  membersCount: { type: Number, required: function() { return this.role === "ngo"; }},
  distanceFromCollege: { type: Number, required: function() { return this.role === "ngo"; }},

  foodPreference: {
  type: String,
  enum: ["veg", "non-veg"],
  required: function () {
    return this.role === "student" || this.role === "staff";
  }
},
points: { type: Number, default: 0 }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
