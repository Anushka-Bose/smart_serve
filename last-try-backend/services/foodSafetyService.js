// Enhanced Food Safety Checker
// checkFoodSafety.js
const axios = require("axios");

exports.checkFoodSafety = async (surplus) => {
  try {
    let isSafe = true;
    let reason = "Food passed all checks";

    // 1️⃣ Quick spoilage check
    const highRiskItems = ["milk", "curd"];
    if (highRiskItems.includes(surplus.foodItem.toLowerCase())) {
      isSafe = false;
      reason = "High-risk item spoils quickly";
    }

    // 2️⃣ Weather check
    try {
      const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
      const CITY = process.env.CITY || "YourCity";
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${WEATHER_API_KEY}&units=metric`
      );

      const temp = weatherRes.data.main.temp;
      const humidity = weatherRes.data.main.humidity;

      if ((temp > 32 && !surplus.isVeg) || humidity > 98) {
        isSafe = false;
        reason = `Unfavorable weather (Temp: ${temp}°C, Humidity: ${humidity}%)`;
      }
    } catch (err) {
      console.warn("⚠️ Weather API failed, skipping weather check.");
    }

    // ✅ Save results into the surplus document
    surplus.isSafeToEat = isSafe;
    surplus.safetyReason = reason;
    surplus.checkedAt = new Date();
    await surplus.save();

    if (isSafe) {
      console.log(`✅ ${surplus.foodItem} is SAFE.`);
    } else {
      console.log(`❌ ${surplus.foodItem} marked UNSAFE. Reason: ${reason}`);
    }

    // ✅ Return the updated surplus itself
    return surplus;

  } catch (err) {
    console.error("🔥 Error in food safety check:", err.message);
    surplus.isSafeToEat = false;
    surplus.safetyReason = "Internal error during safety check";
    await surplus.save();
    return surplus;
  }
};
