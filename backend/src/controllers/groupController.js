const Group = require("../models/Group");
const GroupExpense = require("../models/GroupExpense");

const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Group name is required" });
    }

    const allMembers = Array.isArray(members) ? members : [];

    // Add creator if not already included
    if (!allMembers.includes(req.user.id.toString())) {
      allMembers.push(req.user.id.toString());
    }

    const group = await Group.create({
      name,
      members: allMembers,
      createdBy: req.user.id,
    });

    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id })
      .populate("members", "name email")
      .populate("createdBy", "name email");
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("members", "name email")
      .populate("createdBy", "name email");

    if (!group) return res.status(404).json({ message: "Group not found" });
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createGroup, getUserGroups, getGroupById };
