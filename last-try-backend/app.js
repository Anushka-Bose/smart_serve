const express = require('express');
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const surplusRoutes = require("./routes/surplusRoutes");
const { checkEventsToday } = require("./controllers/eventController");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const app = express();

app.use(express.json());
const cors = require('cors');
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/surplus", surplusRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// Keep only event reminder cron if you still need it
// This checks every day at 00:01
// If you don’t want *any* cron, you can remove this block too.
const cron = require("node-cron");
cron.schedule("1 0 * * *", () => {
  console.log("⏰ Checking today's events...");
  checkEventsToday();
});

module.exports = app;
