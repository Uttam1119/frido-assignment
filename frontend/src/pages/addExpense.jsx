import React, { useEffect, useState } from "react";
import { createExpense, fetchUsers } from "../api";

function AddExpense({ token, currentUserId }) {
  const [users, setUsers] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers(token)
      .then((data) => {
        setUsers(data);
        if (currentUserId && data.some((u) => u._id === currentUserId)) {
          setPaidBy(currentUserId);
        } else if (data.length > 0) {
          setPaidBy(data[0]._id);
        }
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, [token, currentUserId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !description ||
      !amount ||
      !paidBy ||
      selectedParticipants.length === 0
    ) {
      setMessage("⚠️ Please fill all fields and select participants.");
      return;
    }

    try {
      await createExpense(
        {
          description,
          amount: Number(amount),
          paidBy,
          participants: selectedParticipants,
        },
        token
      );

      setMessage("✅ Expense added successfully!");
      setDescription("");
      setAmount("");
      setSelectedParticipants([]);
      setPaidBy(currentUserId || "");
    } catch (err) {
      console.error("Error creating expense:", err);
      setMessage("❌ Failed to add expense.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8">
        <h2 className="text-2xl font-extrabold text-center text-indigo-700 mb-6">
          Add New Expense{" "}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Dinner at Cafe"
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
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 1200"
            />
          </div>

          {/* Paid By */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Paid By
            </label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg p-2.5 outline-none transition"
            >
              <option value="" disabled>
                Select payer
              </option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Participants */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Select Participants
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {users.map((user) => (
                <label
                  key={user._id}
                  className="flex items-center space-x-2 bg-indigo-50 hover:bg-indigo-100 rounded-md p-2 cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    className="accent-indigo-600"
                    value={user._id}
                    checked={selectedParticipants.includes(user._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedParticipants([
                          ...selectedParticipants,
                          user._id,
                        ]);
                      } else {
                        setSelectedParticipants(
                          selectedParticipants.filter((id) => id !== user._id)
                        );
                      }
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

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

export default AddExpense;
