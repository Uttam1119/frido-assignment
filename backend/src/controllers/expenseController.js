const Expense = require("../models/Expense.js");

// Create expense
const createExpense = async (req, res, next) => {
  console.log("Request body:", req.body);
  try {
    const { description, amount, paidBy, participants, date } = req.body;
    if (
      !description ||
      !amount ||
      !paidBy ||
      !participants ||
      !participants.length
    ) {
      return res.status(400).json({
        message: "description, amount, paidBy and participants are required",
      });
    }
    const expense = new Expense({
      description,
      amount,
      paidBy,
      participants,
      date,
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
};

// Get all expenses
const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    next(err);
  }
};

// Delete expense
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted" });
  } catch (err) {
    next(err);
  }
};

// Calculate balances and suggested settlements
const getBalances = async (req, res, next) => {
  try {
    const expenses = await Expense.find();
    // net balances per user: positive => should receive money; negative => owes money
    const net = {};

    for (const e of expenses) {
      const { amount, participants, paidBy } = e;
      const n = participants.length;
      if (n === 0) continue;
      const share = amount / n;

      participants.forEach((p) => {
        if (!net[p]) net[p] = 0;
      });
      if (!net[paidBy]) net[paidBy] = 0;

      // Each participant owes `share` (including paidBy)
      participants.forEach((p) => {
        net[p] -= share;
      });

      net[paidBy] += amount;
    }

    // Round balances to 2 decimals
    Object.keys(net).forEach((k) => {
      net[k] = Math.round((net[k] + Number.EPSILON) * 100) / 100;
      if (Object.is(net[k], -0)) net[k] = 0;
    });

    // Create settlements
    const creditors = [];
    const debtors = [];
    Object.entries(net).forEach(([user, bal]) => {
      if (bal > 0) creditors.push({ user, amount: bal });
      else if (bal < 0) debtors.push({ user, amount: -bal });
    });

    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    const settlements = [];

    let i = 0,
      j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const settledAmount = Math.min(debtor.amount, creditor.amount);
      settlements.push({
        from: debtor.user,
        to: creditor.user,
        amount: Math.round((settledAmount + Number.EPSILON) * 100) / 100,
      });
      debtor.amount -= settledAmount;
      creditor.amount -= settledAmount;
      if (Math.abs(debtor.amount) < 0.005) i++;
      if (Math.abs(creditor.amount) < 0.005) j++;
    }

    res.json({ balances: net, settlements });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createExpense,
  getExpenses,
  deleteExpense,
  getBalances,
};
