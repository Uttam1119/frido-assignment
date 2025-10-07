import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createGroupExpense, fetchGroupDetails } from "../api.js";

function AddGroupExpense({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    description: "",
    amount: "",
    paidBy: "",
    category: "",
    splitType: "equal",
  });
  const [group, setGroup] = useState(null);
  const [message, setMessage] = useState("");
  const [splitsInput, setSplitsInput] = useState({}); // For unequal/percentage

  // Load group
  useEffect(() => {
    const loadGroup = async () => {
      try {
        const data = await fetchGroupDetails(id, token);
        setGroup(data);

        const storedUser = localStorage.getItem("user");
        const currentUser = storedUser ? JSON.parse(storedUser) : null;
        if (
          currentUser &&
          data.members.some((m) => m._id === currentUser._id)
        ) {
          setForm((prev) => ({ ...prev, paidBy: currentUser._id }));
        }

        // Initialize splitsInput for members
        const initialSplits = {};
        data.members.forEach((m) => (initialSplits[m._id] = ""));
        setSplitsInput(initialSplits);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load group");
      }
    };
    loadGroup();
  }, [id, token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSplitChange = (userId, value) => {
    setSplitsInput({ ...splitsInput, [userId]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare splitDetails for unequal/percentage
    let splitDetails = [];
    if (form.splitType === "unequal" || form.splitType === "percentage") {
      splitDetails = group.members.map((m) => ({
        userId: m._id,
        amount: parseFloat(splitsInput[m._id] || 0),
      }));
    }

    try {
      await createGroupExpense(
        {
          ...form,
          amount: Number(form.amount),
          groupId: id,
          splitDetails,
        },
        token
      );
      setMessage("Expense added successfully!");
      setTimeout(() => navigate(`/groups/${id}`), 1000);
    } catch (err) {
      setMessage(
        "Failed to add expense: " + err.response?.data?.message || err.message
      );
      console.error(err);
    }
  };

  if (!group) return <p className="text-gray-500">Loading group members...</p>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-indigo-700 mb-4">
        Add Group Expense
      </h2>
      {message && (
        <p className="text-center text-sm mb-3 text-gray-700">{message}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          placeholder="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Amount"
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
        />
        <div>
          <label className="block text-sm font-medium mb-1">Paid By:</label>
          <select
            name="paidBy"
            className="w-full border p-2 rounded"
            value={form.paidBy}
            onChange={handleChange}
          >
            <option value="">Select payer</option>
            {group.members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <input
          className="w-full border p-2 rounded"
          placeholder="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
        />
        <select
          name="splitType"
          className="w-full border p-2 rounded"
          value={form.splitType}
          onChange={handleChange}
        >
          <option value="equal">Equal</option>
          <option value="unequal">Unequal</option>
          <option value="percentage">Percentage</option>
        </select>

        {(form.splitType === "unequal" || form.splitType === "percentage") && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Enter {form.splitType === "percentage" ? "percentage" : "amount"}{" "}
              for each member:
            </p>
            {group.members.map((m) => (
              <div
                key={m._id}
                className="flex justify-between items-center gap-2"
              >
                <span>{m.name}</span>
                <input
                  type="number"
                  min="0"
                  className="border p-1 rounded w-24"
                  value={splitsInput[m._id]}
                  onChange={(e) => handleSplitChange(m._id, e.target.value)}
                />
                {form.splitType === "percentage" && <span>%</span>}
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}

export default AddGroupExpense;
