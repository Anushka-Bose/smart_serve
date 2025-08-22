const Surplus = require("../models/Surplus");
const Event = require("../models/Event");
const { distributeFoodLogic } = require("../services/distributionService");
const { checkFoodSafety } = require("../services/foodSafetyService"); // ✅ improved food safety service

// 👉 1. Log surplus + auto food safety check + distribution
exports.logSurplus = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { quantity, foodItem, isVeg } = req.body;

    // ✅ Validate event
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // ✅ Role check
    const allowedRoles = ["organizer"];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // ✅ Create surplus entry
    let surplus = await Surplus.create({
      event: event._id,
      quantity,
      foodItem,
      isVeg,
      loggedBy: req.user.id,
      loggedAt: new Date(),
    });

    console.log(`📦 Surplus logged: ${surplus.foodItem} (${surplus.quantity})`);

    // ✅ Step 1: Run food safety check immediately
    surplus = await checkFoodSafety(surplus);

    if (!surplus.isSafeToEat) {
      console.log(`❌ ${surplus.foodItem} marked UNSAFE. Skipping distribution.`);
      return res.json({
        message: `Surplus logged, but ${surplus.foodItem} is NOT safe to distribute`,
        surplus,
      });
    }

    // ✅ Step 2: If safe, auto distribute
    surplus = await distributeFoodLogic(surplus);

    

    return res.json({
      message: `Surplus logged, ${surplus.foodItem} is safe and distribution started`,
      surplus,
    });
  } catch (err) {
    console.error("❌ Error logging surplus:", err);
    res.status(500).json({
      message: "Failed to log surplus",
      error: err.message,
    });
  }
};

// 👉 2. Manual distribution endpoint (optional, if you still want it)
// exports.distributeFood = async (req, res) => {
//   try {
//     const { surplusId } = req.params;
//     const surplus = await Surplus.findById(surplusId);
//     if (!surplus) return res.status(404).json({ message: "Surplus not found" });

//     const result = await distributeFoodLogic(surplus);

//     res.json({ message: "Food distribution completed", result });
//   } catch (err) {
//     res.status(500).json({
//       message: "Failed to distribute food",
//       error: err.message,
//     });
//   }
// };
