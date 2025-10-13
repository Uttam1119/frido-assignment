import React, { useState, useEffect } from "react";

function QuickSplit() {
  const [participants, setParticipants] = useState(() => {
    const saved = localStorage.getItem("qs_participants");
    return saved ? JSON.parse(saved) : [];
  });
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("qs_expenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState("");
  const [expense, setExpense] = useState({
    description: "",
    amount: "",
    paidBy: "",
    participants: [],
    splitType: "Equal",
    shares: {},
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [balances, setBalances] = useState({});
  const [settlements, setSettlements] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("qs_participants", JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem("qs_expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addParticipant = () => {
    const trimmed = name.trim();
    if (trimmed && !participants.includes(trimmed)) {
      setParticipants((prev) => [...prev, trimmed]);
      setName("");
    }
  };

  const removeParticipant = (p) => {
    if (
      window.confirm(
        `Remove participant "${p}"? It will also remove them from expenses.`
      )
    ) {
      setParticipants((prev) => prev.filter((x) => x !== p));
      setExpenses((prev) =>
        prev.map((e) => ({
          ...e,
          participants: e.participants.filter((x) => x !== p),
        }))
      );
    }
  };

  const handleSplitTypeChange = (type) => {
    setExpense({ ...expense, splitType: type, shares: {} });
  };

  const addExpense = () => {
    if (
      !expense.description ||
      !expense.amount ||
      !expense.paidBy ||
      expense.participants.length === 0
    ) {
      setMessage("⚠️ Please fill all fields.");
      return;
    }

    const total = Number(expense.amount);
    if (expense.splitType === "Unequal") {
      const sum = Object.values(expense.shares).reduce(
        (a, b) => a + Number(b || 0),
        0
      );
      if (sum !== total) {
        setMessage("⚠️ Unequal shares must sum up to total amount.");
        return;
      }
    } else if (expense.splitType === "Percentage") {
      const sum = Object.values(expense.shares).reduce(
        (a, b) => a + Number(b || 0),
        0
      );
      if (sum !== 100) {
        setMessage("⚠️ Percentages must sum up to 100.");
        return;
      }
    }

    if (editingIndex !== null) {
      const updated = [...expenses];
      updated[editingIndex] = expense;
      setExpenses(updated);
      setEditingIndex(null);
      setMessage("✅ Expense updated!");
    } else {
      setExpenses([...expenses, { ...expense, amount: total }]);
      setMessage("✅ Expense added!");
    }

    setExpense({
      description: "",
      amount: "",
      paidBy: "",
      participants: [],
      splitType: "Equal",
      shares: {},
    });
  };

  const editExpense = (index) => {
    setExpense(expenses[index]);
    setEditingIndex(index);
  };

  const removeExpense = (index) => {
    if (window.confirm("Delete this expense?")) {
      setExpenses(expenses.filter((_, i) => i !== index));
      setMessage("❌ Expense removed");
    }
  };

  const calculateBalances = () => {
    const net = {};

    expenses.forEach((e) => {
      const { amount, participants, paidBy, splitType, shares } = e;
      const total = Number(amount);

      let distribution = {};
      if (splitType === "Equal") {
        const share = total / participants.length;
        participants.forEach((p) => (distribution[p] = share));
      } else if (splitType === "Unequal") {
        distribution = { ...shares };
      } else if (splitType === "Percentage") {
        participants.forEach(
          (p) => (distribution[p] = (total * (shares[p] || 0)) / 100)
        );
      }

      participants.forEach((p) => {
        if (!net[p]) net[p] = 0;
        net[p] -= distribution[p] || 0;
      });

      if (!net[paidBy]) net[paidBy] = 0;
      net[paidBy] += total;
    });

    const creditors = [];
    const debtors = [];

    Object.entries(net).forEach(([user, bal]) => {
      if (bal > 0) creditors.push({ user, amount: bal });
      else if (bal < 0) debtors.push({ user, amount: -bal });
    });

    const settlements = [];
    let i = 0,
      j = 0;
    while (i < debtors.length && j < creditors.length) {
      const settledAmount = Math.min(debtors[i].amount, creditors[j].amount);
      settlements.push({
        from: debtors[i].user,
        to: creditors[j].user,
        amount: settledAmount,
      });
      debtors[i].amount -= settledAmount;
      creditors[j].amount -= settledAmount;
      if (debtors[i].amount === 0) i++;
      if (creditors[j].amount === 0) j++;
    }

    setBalances(net);
    setSettlements(settlements);
    setMessage("✅ Balances calculated!");
  };

  const resetAll = () => {
    if (window.confirm("Clear all data?")) {
      setParticipants([]);
      setExpenses([]);
      setBalances({});
      setSettlements([]);
      localStorage.removeItem("qs_participants");
      localStorage.removeItem("qs_expenses");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center py-10 px-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 space-y-6">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700">
          ⚡ Quick Split
        </h2>

        {message && (
          <p
            className={`text-center text-sm mb-4 ${
              message.includes("✅")
                ? "text-green-600"
                : message.includes("⚠️")
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Participants */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Add Participants
          </h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg p-2.5 outline-none transition"
              placeholder="Enter participant name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              onClick={addParticipant}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-lg"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {participants.map((p) => (
              <span
                key={p}
                className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
              >
                {p}
                <button
                  onClick={() => removeParticipant(p)}
                  className="text-red-600 hover:text-red-800 font-bold text-xs"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </section>

        {/* Add / Edit Expense */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {editingIndex !== null ? "Edit Expense" : "Add Expense"}
          </h3>

          <input
            className="w-full border border-gray-300 rounded-lg p-2.5 mb-3"
            placeholder="Description"
            value={expense.description}
            onChange={(e) =>
              setExpense({ ...expense, description: e.target.value })
            }
          />
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg p-2.5 mb-3"
            placeholder="Amount"
            value={expense.amount}
            onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
          />

          <select
            className="w-full border border-gray-300 rounded-lg p-2.5 mb-3"
            value={expense.paidBy}
            onChange={(e) => setExpense({ ...expense, paidBy: e.target.value })}
          >
            <option value="">Select payer</option>
            {participants.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            className="w-full border border-gray-300 rounded-lg p-2.5 mb-3"
            value={expense.splitType}
            onChange={(e) => handleSplitTypeChange(e.target.value)}
          >
            <option value="Equal">Equal Split</option>
            <option value="Unequal">Unequal Split</option>
            <option value="Percentage">Percentage Split</option>
          </select>

          <div className="border border-gray-200 rounded-lg p-3 mb-3">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Select Participants:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {participants.map((p) => (
                <div
                  key={p}
                  className="flex items-center space-x-2 bg-indigo-50 hover:bg-indigo-100 rounded-md p-2 cursor-pointer transition"
                >
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="accent-indigo-600"
                      checked={expense.participants.includes(p)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...expense.participants, p]
                          : expense.participants.filter((x) => x !== p);
                        setExpense({ ...expense, participants: updated });
                      }}
                    />
                    <span>{p}</span>
                  </label>

                  {expense.splitType !== "Equal" &&
                    expense.participants.includes(p) && (
                      <input
                        type="number"
                        placeholder={
                          expense.splitType === "Unequal" ? "₹" : "%"
                        }
                        className="border border-gray-300 rounded-md p-1 w-20 text-right"
                        value={expense.shares[p] || ""}
                        onChange={(e) =>
                          setExpense({
                            ...expense,
                            shares: { ...expense.shares, [p]: e.target.value },
                          })
                        }
                      />
                    )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={addExpense}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg"
          >
            {editingIndex !== null ? "Update Expense" : "Add Expense"}
          </button>
        </section>

        {/* Expense List */}
        {expenses.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Added Expenses
            </h3>
            <ul className="space-y-2">
              {expenses.map((e, idx) => (
                <li
                  key={idx}
                  className="p-3 border border-gray-100 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center"
                >
                  <div>
                    <strong>{e.description}</strong> — ₹{e.amount}
                    <br />
                    <span className="text-sm text-gray-600 block mt-1">
                      Paid by <b>{e.paidBy}</b> • {e.splitType} Split
                      <br />
                      <span className="text-xs text-gray-500">
                        Participants:{" "}
                        {e.participants && e.participants.length > 0
                          ? e.participants.join(", ")
                          : "None"}
                      </span>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editExpense(idx)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => removeExpense(idx)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={calculateBalances}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg"
          >
            Calculate
          </button>
          <button
            onClick={resetAll}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg"
          >
            Reset
          </button>
        </div>

        {/* Results */}
        {Object.keys(balances).length > 0 && (
          <section className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              💰 Net Balances
            </h3>
            <ul className="space-y-2">
              {Object.entries(balances).map(([p, bal]) => (
                <li
                  key={p}
                  className={`p-2 rounded-lg font-medium ${
                    bal >= 0
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {p}:{" "}
                  {bal >= 0 ? `Receives ₹${bal}` : `Owes ₹${Math.abs(bal)}`}
                </li>
              ))}
            </ul>

            {settlements.length > 0 && (
              <>
                <h4 className="text-md font-semibold mt-4 mb-2 text-indigo-700">
                  🔄 Suggested Settlements
                </h4>
                <ul className="space-y-2">
                  {settlements.map((s, idx) => (
                    <li
                      key={idx}
                      className="p-2 bg-indigo-50 rounded-lg text-indigo-800 font-medium shadow-sm"
                    >
                      {s.from} → {s.to}: ₹{s.amount}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default QuickSplit;
