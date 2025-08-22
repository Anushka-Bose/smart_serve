// routes/leaderboard.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Leaderboard = require("../models/Leaderboard");
const { authMiddleware } = require("../middleware/authMiddleware");

// ✅ Admin gives/takes points after verifying food pickup
router.post("/update-points", authMiddleware, async (req, res) => {
  try {
    // Only allow admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { userId, pointsChange, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    // update user total points
    const points = Number(pointsChange);
    user.points = Number(user.points) + points;
    await user.save();

    // log in leaderboard history
    await Leaderboard.create({
      user: userId,
      pointsChange,
      reason
    });

    res.json({ message: "Points updated", user });
  } catch (err) {
    console.error("🔥 Error updating points:", err);
    res.status(500).send("Internal server error: " + err.message);
  }
});

// Get top users (all-time)
// Current leaderboard (all-time)
// Current leaderboard (all-time)
// Current leaderboard (all-time)
router.get("/current", async (req, res) => {
  try {
    // Step 1: Aggregate all-time points from Leaderboard collection
    const totalPoints = await Leaderboard.aggregate([
  {
    $group: {
      _id: "$user",
      totalPoints: { $sum: "$pointsChange" }  // no $toDouble
    }
  }
]);


    // Step 2: Fetch all users
    const users = await User.find({}, "name role").lean();

    // Step 3: Merge users with aggregated points
    const leaderboard = users.map(u => {
      const tp = totalPoints.find(t => t._id.toString() === u._id.toString());
      return {
        _id: u._id,
        name: u.name,
        role: u.role,
        points: tp ? tp.totalPoints : 0
      };
    });

    // Step 4: Custom sorting: positives → zeros → negatives
    leaderboard.sort((a, b) => {
  // Case 1: a > 0, b <= 0 → a first
  if (a.points > 0 && b.points <= 0) return -1;
  if (a.points <= 0 && b.points > 0) return 1;

  // Case 2: both > 0 → sort descending
  if (a.points > 0 && b.points > 0) return b.points - a.points;

  // Case 3: both == 0 → keep stable order
  if (a.points === 0 && b.points === 0) return 0;

  // Case 4: one is 0, one negative → 0 first
  if (a.points === 0 && b.points < 0) return -1;
  if (a.points < 0 && b.points === 0) return 1;

  // Case 5: both negative → closer to 0 higher
  return b.points - a.points;
});


    res.json(leaderboard);
  } catch (err) {
    console.error("🔥 Current leaderboard error:", err);
    res.status(500).send("Error fetching current leaderboard");
  }
});




// Get leaderboard for a given month (default = current month)
// Get leaderboard for a given month (default = current month)
router.get("/monthly", async (req, res) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth(); // 0 = Jan
    const year = parseInt(req.query.year) || now.getFullYear();

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 1);

    // Aggregate points per user for the month
    const monthlyPoints = await Leaderboard.aggregate([
      { $match: { createdAt: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: "$user",
          totalPoints: { $sum: { $toDouble: "$pointsChange" } }
        }
      }
    ]);

    // Get all users and merge with monthly points
    const users = await User.find({}, "name role").lean();

    const leaderboard = users.map(u => {
      const mp = monthlyPoints.find(m => m._id.toString() === u._id.toString());
      return {
        _id: u._id,
        name: u.name,
        role: u.role,
        points: mp ? mp.totalPoints : 0
      };
    });

    // Sort descending numerically
    leaderboard.sort((a, b) => b.points - a.points);

    res.json(leaderboard);
  } catch (err) {
    console.error("🔥 Monthly leaderboard error:", err);
    res.status(500).send("Error fetching monthly leaderboard");
  }
});




// Get all point changes for one user
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await Leaderboard.find({ user: userId })
      .populate("user", "name role")
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).send("Error fetching user history");
  }
});

module.exports=router;