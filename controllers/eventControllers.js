const { json } = require("express");
const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
  console.log("create event called");
  const { title, eventType, time, location, eventPhoto } = req.body;

  if (!title || !eventPhoto || !eventType || !time || !location)
    return res.status(400).json({ message: "Missing required fields" });
  try {
    const createdEvent = new Event(req.body);

    await createdEvent.save();
    res.status(200).json(createdEvent);
  } catch (error) {
    console.log(error);
  }
};
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body);
    if (!updatedEvent)
      return res.status(404).json({ message: "Event not found" });
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.log(error);
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const allEvent = await Event.find({});

    res.status(200).json(allEvent);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent)
      return res.status(404).json({ message: "Event not found" });

    res.status(200).json(deletedEvent);
  } catch (error) {
    console.log(error);
  }
};
