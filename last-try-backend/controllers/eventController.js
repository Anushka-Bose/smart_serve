const Event = require("../models/Event");

const transporter = require("../config/email");

// Create Event (organizer only)
exports.createEvent = async (req, res) => {
  try {
    const { title, date, description, eventTime } = req.body;

    const event = await Event.create({
      title,
      date,
      eventTime,
      description,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "Event created", event });
  } catch (err) {
    res.status(500).json({ message: "Failed to create event", error: err.message });
  }
};

// Notify organizers when event date arrives
exports.checkEventsToday = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await Event.find({
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    }).populate("createdBy");

    for (const event of events) {
      const organizer = event.createdBy;

      if (organizer && organizer.email) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: organizer.email,
          subject: `Event Reminder: ${event.title}`,
          text: `Hello ${organizer.name},\n\nYour event "${event.title}" is today. Please log the surplus afterwards.\n\nThanks,\nSmart Food System`
        });
        console.log(`📧 Reminder sent to ${organizer.email}`);
      }
    }
  } catch (err) {
    console.error("Error checking events:", err.message);
  }
};
