const express = require("express");
const { createEvent } = require("../controllers/eventController");
const {logSurplus}=require("../controllers/surplusController")
const { authMiddleware, requireOrganizer } = require("../middleware/authMiddleware");
const { checkEventsToday } = require("../controllers/eventController");
const { checkFoodSafety } = require("../services/foodSafetyService");
const transporter=require("../config/email");

const router = express.Router();

router.post("/create", authMiddleware, requireOrganizer, createEvent);

router.post("/log-surplus/:eventId", authMiddleware, logSurplus);

//Eta remove kore debo
router.get("/test-reminder", async (req, res) => {
  try {
    await checkEventsToday();
    res.json({ message: "Reminder check executed manually" });
  } catch (err) {
    res.status(500).json({ message: "Test failed", error: err.message });
  }
});

//Etao remove kore debo
router.get("/check", async (req, res) => {
  try {
    const sentEmails = [];

    const originalSendMail = transporter.sendMail.bind(transporter);
    transporter.sendMail = async (mailOptions) => {
      sentEmails.push(mailOptions.to);
      return originalSendMail(mailOptions);
    };

    await checkFoodSafety();

    res.json({
      message: "Food safety check executed manually",
      emailsSentTo: sentEmails.length ? sentEmails : "No emails sent"
    });

    transporter.sendMail = originalSendMail;
  } catch (err) {
    res.status(500).json({ message: "Test failed", error: err.message });
  }
});

module.exports = router;
