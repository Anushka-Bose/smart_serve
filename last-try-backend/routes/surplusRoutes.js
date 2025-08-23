
const express = require("express");
const Surplus = require("../models/Surplus");
const surplusController = require("../controllers/surplusController");
const {authenticateToken} = require("../middleware/authMiddleware");
const User = require("../models/User");
const transporter=require('../config/email')
const { getUpcomingEventPredictions } = require("../services/distributionService");


const router = express.Router();

// GET all surplus
router.get("/", async (req, res) => {
  try {
    const surplus = await Surplus.find().sort({ createdAt: -1 });
    res.json({ data: surplus });
  } catch (error) {
    console.error("Error fetching surplus:", error);
    res.status(500).json({ message: "Failed to fetch surplus", error: error.message });
  }
});

// GET ML predictions for upcoming events
router.get("/predictions", authenticateToken, async (req, res) => {
  try {
    const predictions = await getUpcomingEventPredictions();
    res.json({ 
      success: true, 
      data: predictions,
      message: "ML predictions retrieved successfully"
    });
  } catch (error) {
    console.error("Error fetching ML predictions:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch ML predictions", 
      error: error.message 
    });
  }
});

router.post("/:eventId/log", authenticateToken, surplusController.logSurplus);
//router.post("/:surplusId/distribute", authMiddleware, surplusController.distributeFood);

router.get("/claim/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { token, userId } = req.query;

    console.log("📩 Claim request:", { id, token, userId });

    const surplus = await Surplus.findById(id).populate("event");
    if (!surplus) return res.status(404).send("❌ Surplus not found");

    if (surplus.isClaimed) {
      return res.send("❌ Sorry, this food has already been claimed.");
    }

    if (surplus.claimToken !== token) {
      return res.status(400).send("❌ Invalid or expired claim token.");
    }

    // ✅ Check if this user is allowed to claim based on quantity rules
    let canClaim = false;

    if (surplus.distributedTo === "students/staff") {
      const studentsStaff = await User.find({
        role: { $in: ["student", "staff"] },
        foodPreference: surplus.isVeg ? "veg" : "non-veg"
      }).limit(10);
      canClaim = studentsStaff.some(u => u._id.equals(userId));
    } else if (surplus.distributedTo === "canteen/hostel") {
      const canteenHostel = await User.find({ role: { $in: ["canteen", "hostel"] } });
      canClaim = canteenHostel.some(u => u._id.equals(userId));
    } else if (surplus.distributedTo === "ngo") {
      const ngos = await User.find({ role: "ngo" }).sort({ distanceFromCollege: 1 });
      // pick top 1 or 2 based on quantity
      const limit = surplus.quantity > 25 ? 2 : 1;
      canClaim = ngos.slice(0, limit).some(u => u._id.equals(userId));
    }

    if (!canClaim) {
      return res.send("⚠️ You are not authorized to claim this surplus food.");
    }

    // ✅ Mark as claimed
    surplus.isClaimed = true;
    surplus.claimedBy = userId || null;
    surplus.claimedAt = new Date();
    await surplus.save();

    // ✅ Notify admins
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      if (admin.email) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: admin.email,
          subject: `✅ Food Claimed: ${surplus.foodItem}`,
          text:
            `Hello Admin,\n\n` +
            `The surplus food "${surplus.foodItem}" (${surplus.quantity}) ` +
            `from the event "${surplus.event?.title || "Unknown Event"}" ` +
            `on ${surplus.event?.date ? surplus.event.date.toDateString() : "Unknown Date"} ` +
            `has just been claimed.\n\n` +
            `Claimed by User ID: ${userId || "Unknown"}\n\n` +
            `Thanks,\nSmart Food System`
        });
      }
    }

    return res.send(`✅ You have successfully claimed ${surplus.foodItem}!`);
  } catch (err) {
    console.error("🔥 Claim error:", err);
    res.status(500).send("Internal server error: " + err.message);
  }
});





    // ✅ Notify all admins
//     const admins = await User.find({ role: "admin" });
//     for (const admin of admins) {
//       if (admin.email) {
//         await transporter.sendMail({
//           from: process.env.EMAIL_USER,
//           to: admin.email,
//           subject: `Food Claimed: ${surplus.foodItem}`,
//           text: `Hello ${admin.name},\n\n` +
//                 `The surplus food "${surplus.foodItem}" (${surplus.quantity}) was claimed by ${claimingUser.name} (${claimingUser.role}).\n\n` +
//                 `Time: ${surplus.claimedAt}\n\n` +
//                 `Thanks,\nSmart Food System`
//         });
//       }
//     }

//     res.send("✅ Food successfully claimed! Admins have been notified.");
//   } catch (error) {
//     console.error("❌ Claim error:", error);
//     res.status(500).send("Server error while claiming food");
//   }
// });

module.exports = router;
