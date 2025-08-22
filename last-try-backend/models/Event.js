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
  city:{type:String},
  meals_served:{type:Number},
  kitchen_staff:{type:Number},

  // Reference to surplus entries
  food_category:{
    type:String,
    enum:['grains','meat','vegetables','dairy']
  },

  reminderSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
