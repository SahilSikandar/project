const MemberVolunteer = require("../models/MemberVolunteer");

exports.add = async (req, res) => {
  const { serialNo, name, designation, validTill, type } = req.body;

  console.log("Add called", type);
  try {
    const newMemberVolunteer = new MemberVolunteer({
      serialNo,
      name,
      designation,
      validTill,
      type,
    });
    const savedMemberVolunteer = await newMemberVolunteer.save();
    res.status(200).json(savedMemberVolunteer);
  } catch (error) {
    console.log(error);
  }
};
exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const person = await MemberVolunteer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (person) return res.status(200).json(person);
    else return res.status(404).json({ message: "Person not fount" });
  } catch (err) {
    console.log(err);
  }
};
exports.deletePerson = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPerson = await MemberVolunteer.findByIdAndDelete(id);
    if (!deletedPerson)
      return res.status(404).json({ message: "Person couldn't be found" });

    res.status(200).json(deletedPerson);
  } catch (err) {
    console.log(err);
  }
};
exports.getAll = async (req, res) => {
  try {
    const allMembersVolunteers = await MemberVolunteer.find({});
    res.status(200).json(allMembersVolunteers);
  } catch (error) {
    console.log(error);
  }
};
