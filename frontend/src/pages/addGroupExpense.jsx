import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createGroupExpense, fetchGroupDetails } from "../api.js";
import { AuthContext } from "../context/authContext.jsx";

function AddGroupExpense() {
  const { token } = useContext(AuthContext);
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
  const [splitsInput, setSplitsInput] = useState({});

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

        const initialSplits = {};
        data.members.forEach((m) => (initialSplits[m._id] = ""));
        setSplitsInput(initialSplits);
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to load group");
      }
    };
    loadGroup();
  }, [id, token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSplitChange = (userId, value) =>
    setSplitsInput({ ...splitsInput, [userId]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let splitDetails = [];
    if (form.splitType === "unequal" || form.splitType === "percentage") {
      splitDetails = group.members.map((m) => ({
        userId: m._id,
        amount: parseFloat(splitsInput[m._id] || 0),
      }));
    }

    if (!form.description || !form.amount || !form.paidBy) {
      setMessage("⚠️ Please fill all required fields.");
      return;
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
      setMessage("✅ Expense added successfully!");
      setForm({
        description: "",
        amount: "",
        paidBy: form.paidBy,
        category: "",
        splitType: "equal",
      });
      setSplitsInput({});
      setTimeout(() => navigate(`/groups/${id}`), 1000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add expense.");
    }
  };

  if (!group)
    return (
      <p className="text-gray-500 text-center mt-6">Loading group members...</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8">
        <h2 className="text-2xl font-extrabold text-center text-indigo-700 mb-6">
          Add Group Expense
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <input
              className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg p-2.5 outline-none transition"
              placeholder="e.g., Dinner with friends"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg p-2.5 outline-none transition"
              placeholder="e.g., 1200"
              name="amount"
              value={form.amount}
              onChange={handleChange}
            />
          </div>

          {/* Paid By */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Paid By
            </label>
            <select
              name="paidBy"
              value={form.paidBy}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg p-2.5 outline-none transition"
            >
              <option value="">Select payer</option>
              {group.members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Category
            </label>
            <input
              className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg p-2.5 outline-none transition"
              placeholder="e.g., Food, Travel"
              name="category"
              value={form.category}
              onChange={handleChange}
            />
          </div>

          {/* Split Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Split Type
            </label>
            <select
              name="splitType"
              value={form.splitType}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg p-2.5 outline-none transition"
            >
              <option value="equal">Equal</option>
              <option value="unequal">Unequal</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>

          {/* Splits Input */}
          {(form.splitType === "unequal" ||
            form.splitType === "percentage") && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Enter{" "}
                {form.splitType === "percentage" ? "percentage" : "amount"} for
                each member:
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
                    className="border border-gray-300 p-2 rounded-lg w-28 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium shadow-md transition"
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddGroupExpense;
