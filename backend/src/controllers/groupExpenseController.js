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
    const { description, amount, paidBy, category, splitType, splitDetails } =
      req.body;

    const groupId = req.params.groupId;

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

const getGroupBalances = async (req, res) => {
  try {
    const expenses = await GroupExpense.find({ groupId: req.params.groupId });
    const net = {};

    // Step 1: Compute net balances
    for (const e of expenses) {
      const { paidBy, amount, splitDetails } = e;
      if (!net[paidBy]) net[paidBy] = 0;
      net[paidBy] += amount;

      splitDetails.forEach((s) => {
        if (!net[s.userId]) net[s.userId] = 0;
        net[s.userId] -= s.amount;
      });
    }

    // Round small decimals
    Object.keys(net).forEach((k) => {
      net[k] = Math.round((net[k] + Number.EPSILON) * 100) / 100;
      if (Object.is(net[k], -0)) net[k] = 0;
    });

    // Step 2: Generate settlements
    const creditors = [];
    const debtors = [];

    for (const [user, balance] of Object.entries(net)) {
      if (balance > 0) creditors.push({ user, amount: balance });
      else if (balance < 0) debtors.push({ user, amount: -balance });
    }

    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    const settlements = [];
    let i = 0,
      j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const payAmount = Math.min(debtor.amount, creditor.amount);

      settlements.push({
        from: debtor.user,
        to: creditor.user,
        amount: Math.round((payAmount + Number.EPSILON) * 100) / 100,
      });

      debtor.amount -= payAmount;
      creditor.amount -= payAmount;

      if (debtor.amount <= 0.005) i++;
      if (creditor.amount <= 0.005) j++;
    }

    res.json({ balances: net, settlements });
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
