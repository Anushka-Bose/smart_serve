const crypto = require("crypto");
const Event = require('../models/Event');
const transporter = require("../config/email");
const User = require("../models/User");
const axios = require("axios");

// ML Microservice configuration
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

/**
 * Fetch predicted food waste from ML microservice
 */
async function getPredictedWaste(event) {
  try {
    // Prepare data for ML prediction
    const predictionData = {
      meals_served: event.meals_served || 100, // Default if not set
      kitchen_staff: event.kitchen_staff || 5, // Default if not set
      past_waste_kg: 0, // Will be calculated from historical data
      special_event_1: false, // Can be enhanced based on event type
      waste_category_GRAINS: event.food_category === 'grains',
      waste_category_MEAT: event.food_category === 'meat',
      waste_category_VEGETABLES: event.food_category === 'vegetables',
      city: event.city || "Mumbai" // Default city
    };

    // Get historical waste data for past_waste_kg calculation
    const pastWaste = await calculatePastWaste(event.city);
    predictionData.past_waste_kg = pastWaste;

    console.log("🤖 Calling ML service with data:", predictionData);

    // Call ML microservice
    const response = await axios.post(`${ML_SERVICE_URL}/predwaste`, predictionData, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const predictedWaste = response.data.pred;
    console.log("📊 ML Predicted waste:", predictedWaste, "kg");

    return {
      success: true,
      predictedWaste: predictedWaste,
      confidence: "high" // ML model confidence
    };

  } catch (error) {
    console.error("❌ ML Service Error:", error.message);
    return {
      success: false,
      predictedWaste: null,
      error: error.message
    };
  }
}

/**
 * Calculate past waste based on historical data
 */
async function calculatePastWaste(city) {
  try {
    // Get surplus data from the last 7 days for the city
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const Surplus = require('../models/Surplus');
    const pastSurplus = await Surplus.find({
      loggedAt: { $gte: sevenDaysAgo },
      // You can add city filter if you store city in surplus
    }).populate('event');

    // Calculate average waste
    const totalWaste = pastSurplus.reduce((sum, surplus) => {
      // Convert meals to kg (rough estimation: 1 meal ≈ 0.3 kg)
      return sum + (surplus.quantity * 0.3);
    }, 0);

    const averageWaste = pastSurplus.length > 0 ? totalWaste / pastSurplus.length : 0;
    return Math.round(averageWaste * 100) / 100; // Round to 2 decimal places

  } catch (error) {
    console.error("Error calculating past waste:", error);
    return 0; // Default fallback
  }
}

/**
 * Enhanced distribution logic with ML predictions
 */
async function distributeFoodLogic(surplus) {
  let recipients = [];
  let claimableUsers = [];
  let distributedTo = "";
  let mlInsights = null;

  const event = await Event.findById(surplus.event);
  const eventName = event?.title || "Unknown Event";
  const eventDay = event?.date?.toDateString() || "Unknown Date";

  // 🧠 Get ML prediction for this event
  if (event) {
    mlInsights = await getPredictedWaste(event);
    
    if (mlInsights.success) {
      console.log(`🎯 ML predicts ${mlInsights.predictedWaste}kg waste for event: ${eventName}`);
      
      // Adjust distribution strategy based on ML prediction
      const predictedMeals = Math.round(mlInsights.predictedWaste / 0.3); // Convert kg to meals
      
      // If ML predicts high waste, we might want to be more aggressive in distribution
      if (mlInsights.predictedWaste > 10) {
        console.log("🚨 High waste predicted - adjusting distribution strategy");
        // Increase distribution scope for high waste prediction
        surplus.quantity = Math.max(surplus.quantity, predictedMeals);
      }
    }
  }

  // 🎯 Enhanced distribution logic with ML insights
  if (surplus.quantity <= 5) {
    // Small surplus → students + staff
    const students = await User.find({
      role: "student",
      foodPreference: surplus.isVeg ? "vegetarian" : "non-vegetarian"
    });
    const staffs = await User.find({ 
      role: "staff",
      foodPreference: surplus.isVeg ? "vegetarian" : "non-vegetarian"
    });

    recipients = [...students, ...staffs];
    claimableUsers = recipients.slice(0, 10);
    distributedTo = "students/staff";

  } else if (surplus.quantity > 5 && surplus.quantity <= 15) {
    // Medium surplus → canteen/hostel
    recipients = await User.find({ role: { $in: ["canteen"] } });
    claimableUsers = recipients;
    distributedTo = "canteen";

  } else if (surplus.quantity > 15 && surplus.quantity <= 25) {
    // Large surplus → 1 NGO
    const ngos = await User.find({ role: "ngo" });
    if (ngos.length === 0) {
      surplus.distributedTo = "none";
      await surplus.save();
      return surplus;
    }
    ngos.sort((a, b) => {
      if (a.distanceFromCollege === b.distanceFromCollege) {
        return b.membersCount - a.membersCount;
      }
      return a.distanceFromCollege - b.distanceFromCollege;
    });
    const chosenNgo = ngos[0];
    recipients = [chosenNgo]; 
    claimableUsers = [chosenNgo]; 
    distributedTo = "ngo";

  } else {
    // Very large surplus → 2 NGOs
    const ngos = await User.find({ role: "ngo" });
    if (ngos.length < 2) {
      surplus.distributedTo = "none";
      await surplus.save();
      return surplus;
    }
    ngos.sort((a, b) => {
      if (a.distanceFromCollege === b.distanceFromCollege) {
        return b.membersCount - a.membersCount;
      }
      return a.distanceFromCollege - b.distanceFromCollege;
    });
    recipients = ngos.slice(0, 2);
    claimableUsers = recipients;
    distributedTo = "ngo";
  }

  // ✅ Generate claim token
  const claimToken = crypto.randomBytes(16).toString("hex");
  surplus.claimToken = claimToken;
  surplus.distributedTo = distributedTo;
  surplus.isClaimed = false;
  
  // Store ML insights in surplus for analytics
  if (mlInsights && mlInsights.success) {
    surplus.mlPredictedWaste = mlInsights.predictedWaste;
    surplus.mlConfidence = mlInsights.confidence;
  }
  
  await surplus.save();

  // ✅ Send emails with claim link (KEEPING EXISTING NOTIFICATION LOGIC)
  const claimUrlBase = process.env.BACKEND_URL || "http://localhost:4000";
  for (const user of recipients) {
    if (user.email) {
      const canClaim = claimableUsers.some(u => u._id.equals(user._id));
      const claimLink = canClaim
        ? `${claimUrlBase}/api/surplus/claim/${surplus._id}?token=${claimToken}&userId=${user._id}`
        : null;

      let emailText = `Hello ${user.name},\n\n` +
                      `Good news! Surplus food "${surplus.foodItem}" (${surplus.quantity} meals) is available from the event "${eventName}" on ${eventDay}.\n\n`;

      // Add ML insights to email if available
      if (mlInsights && mlInsights.success) {
        emailText += `🤖 AI Prediction: ${mlInsights.predictedWaste}kg waste predicted for this event type.\n\n`;
      }

      if (claimLink) {
        emailText += `👉 Claim it here: ${claimLink}\n\n` +
                     `⚠️ First come, first serve. Please arrive within 2 hours from the end of event.\n\n`;
      } else {
        emailText += `⚠️ You are notified but cannot claim this surplus.\n\n`;
      }

      emailText += `Thanks,\nSmart Food System`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `🍲 Surplus Food Available: ${surplus.foodItem}`,
        text: emailText
      });
    }
  }

  console.log(`✅ Distributed ${surplus.quantity} ${surplus.foodItem} to ${distributedTo}`);
  if (mlInsights && mlInsights.success) {
    console.log(`🧠 ML Prediction: ${mlInsights.predictedWaste}kg waste predicted`);
  }
  
  return surplus;
}

/**
 * Get ML predictions for upcoming events
 */
async function getUpcomingEventPredictions() {
  try {
    const upcomingEvents = await Event.find({
      date: { $gte: new Date() }
    }).sort({ date: 1 }).limit(10);

    const predictions = [];
    
    for (const event of upcomingEvents) {
      const mlResult = await getPredictedWaste(event);
      predictions.push({
        eventId: event._id,
        eventName: event.title,
        eventDate: event.date,
        predictedWaste: mlResult.success ? mlResult.predictedWaste : null,
        confidence: mlResult.success ? mlResult.confidence : null,
        success: mlResult.success
      });
    }

    return predictions;
  } catch (error) {
    console.error("Error getting upcoming event predictions:", error);
    return [];
  }
}

module.exports = { 
  distributeFoodLogic, 
  getPredictedWaste, 
  getUpcomingEventPredictions 
};

