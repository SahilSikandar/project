const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    eventType: { enum: ["Ongoing", "Upcomming"], type: String, required: true },
    time: { type: Object, required: true },
    location: { type: String, required: true },
    eventPhoto: { type: Object, required: true },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
