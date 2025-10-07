const GroupExpense = require("../models/GroupExpense");
const Group = require("../models/Group");

// Helper: calculate split details
const calculateSplits = (splitType, amount, members, splitDetails = []) => {
  if (splitType === "equal") {
    const share = amount / members.length;
    return members.map((id) => ({ userId: id, amount: share }));
  }

  if (splitType === "unequal") {
    const total = splitDetails.reduce((acc, s) => acc + s.amount, 0);
    if (total !== amount)
      throw new Error("Unequal split amounts must sum to total amount");
    return splitDetails;
  }

  if (splitType === "percentage") {
    const totalPercent = splitDetails.reduce((acc, s) => acc + s.amount, 0);
    if (totalPercent !== 100) throw new Error("Percentages must sum up to 100");
    return splitDetails.map((s) => ({
      userId: s.userId,
      amount: (amount * s.amount) / 100,
    }));
  }

  throw new Error("Invalid split type");
};

// Create group expense
const createGroupExpense = async (req, res) => {
  try {
    const {
      description,
      amount,
      paidBy,
      groupId,
      category,
      splitType,
      splitDetails,
    } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const members = group.members.map((m) => m.toString());
    const splits = calculateSplits(splitType, amount, members, splitDetails);

    const GroupExpenses = await GroupExpense.create({
      description,
      amount,
      paidBy,
      groupId,
      category,
      splitType,
      splitDetails: splits,
      date: new Date(),
    });

    res.status(201).json(GroupExpenses);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get group expenses
const getGroupExpenses = async (req, res) => {
  try {
    const GroupExpenses = await GroupExpense.find({
      groupId: req.params.groupId,
    })
      .populate("paidBy", "name")
      .populate("splitDetails.userId", "name");
    res.json(GroupExpenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get group balances
const getGroupBalances = async (req, res) => {
  try {
    const GroupExpenses = await GroupExpense.find({
      groupId: req.params.groupId,
    });
    const net = {};

    GroupExpenses.forEach((exp) => {
      const { paidBy, amount, splitDetails } = exp;
      if (!net[paidBy]) net[paidBy] = 0;
      net[paidBy] += amount;

      splitDetails.forEach((s) => {
        if (!net[s.userId]) net[s.userId] = 0;
        net[s.userId] -= s.amount;
      });
    });

    res.json(net);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update group expense
const updateGroupExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, paidBy, category, splitType, splitDetails } =
      req.body;

    const expense = await GroupExpense.findById(id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    if (description) expense.description = description;
    if (amount) expense.amount = amount;
    if (paidBy) expense.paidBy = paidBy;
    if (category) expense.category = category;
    if (splitType) expense.splitType = splitType;

    if (amount || splitType || splitDetails) {
      const group = await Group.findById(expense.groupId);
      if (!group) return res.status(404).json({ message: "Group not found" });
      const members = group.members.map((m) => m.toString());
      expense.splitDetails = calculateSplits(
        splitType || expense.splitType,
        amount || expense.amount,
        members,
        splitDetails || expense.splitDetails
      );
    }

    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete group expense
const deleteGroupExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await GroupExpense.findByIdAndDelete(id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createGroupExpense,
  getGroupExpenses,
  getGroupBalances,
  updateGroupExpense,
  deleteGroupExpense,
};
