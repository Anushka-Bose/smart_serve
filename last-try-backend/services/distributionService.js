const crypto = require("crypto");
const Event=require('../models/Event');
const transporter = require("../config/email");
const User = require("../models/User");


async function distributeFoodLogic(surplus) {
  let recipients = [];
  let claimableUsers = []; // Users who can actually claim
  let distributedTo = "";

  const event = await Event.findById(surplus.event);
  const eventName = event?.title || "Unknown Event";
  const eventDay = event?.date?.toDateString() || "Unknown Date";

  if (surplus.quantity <= 5) {
    // 🎯 Small surplus → students + staff
    const students = await User.find({
      role: "student",
      foodPreference: surplus.isVeg ? "veg" : "non-veg"
    });
    const staffs = await User.find({ role: "staff",
      foodPreference: surplus.isVeg ? "veg" : "non-veg"
    });

    recipients = [...students, ...staffs];
    claimableUsers = recipients.slice(0, 10); // first 10 can claim
    distributedTo = "students/staff";

  } else if (surplus.quantity > 5 && surplus.quantity <= 15) {
    // 🎯 Medium surplus → canteen/hostel
    recipients = await User.find({ role: { $in: ["canteen", "hostel"] } });
    claimableUsers = recipients; // all can claim
    distributedTo = "canteen/hostel";

  } else if (surplus.quantity > 15 && surplus.quantity <= 25) {
    // 🎯 Large surplus → 1 NGO
    const ngos = await User.find({ role: "ngo" });
    if (ngos.length === 0) {
      surplus.distributedTo = "none";
      await surplus.save();
      return surplus;
    }
    ngos.sort((a, b) => {
      if (a.distanceFromCollege === b.distanceFromCollege) {
        return b.members - a.members;
      }
      return a.distanceFromCollege - b.distanceFromCollege;
    });
    const chosenNgo = ngos[0];
    recipients = [chosenNgo]; 
    claimableUsers = [chosenNgo]; 
    distributedTo = "ngo";

  } else {
    // 🎯 Very large surplus → 2 NGOs
    const ngos = await User.find({ role: "ngo" });
    if (ngos.length < 2) {
      surplus.distributedTo = "none";
      await surplus.save();
      return surplus;
    }
    ngos.sort((a, b) => {
      if (a.distanceFromCollege === b.distanceFromCollege) {
        return b.members - a.members;
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
  await surplus.save();

  // ✅ Send emails with claim link
  const claimUrlBase = process.env.BACKEND_URL;
  for (const user of recipients) {
    if (user.email) {
      const canClaim = claimableUsers.some(u => u._id.equals(user._id));
      const claimLink = canClaim
        ? `${claimUrlBase}/api/surplus/claim/${surplus._id}?token=${claimToken}&userId=${user._id}`
        : null;

      let emailText = `Hello ${user.name},\n\n` +
                      `Good news! Surplus food "${surplus.foodItem}" (${surplus.quantity}) is available from the event "${eventName}" on ${eventDay}.\n\n`;

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
  return surplus;
}

module.exports = { distributeFoodLogic };


module.exports = { distributeFoodLogic };

