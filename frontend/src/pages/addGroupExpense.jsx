import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createGroupExpense, fetchGroupDetails } from "../api.js";

function AddGroupExpense({ token }) {
  const { id } = useParams(); // groupId
  const navigate = useNavigate();

  const [form, setForm] = useState({
    description: "",
    amount: "",
    paidBy: "",
    category: "",
    splitType: "equal",
    splitDetails: [],
  });
  const [group, setGroup] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch group details → members
  useEffect(() => {
    const loadGroup = async () => {
      try {
        const data = await fetchGroupDetails(id, token);
        setGroup(data);

        // ✅ Auto-select logged-in user as payer if they exist in the group
        const storedUser = localStorage.getItem("user");
        const currentUser = storedUser ? JSON.parse(storedUser) : null;

        if (
          currentUser &&
          data.members.some((m) => m._id === currentUser._id)
        ) {
          setForm((prev) => ({ ...prev, paidBy: currentUser._id }));
        }
      } catch (err) {
        console.error("Error fetching group:", err);
        setMessage("Failed to load group details");
      }
    };
    loadGroup();
  }, [id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createGroupExpense(
        {
          ...form,
          groupId: id,
          amount: Number(form.amount),
        },
        token
      );
      setMessage("Expense added successfully!");
      setTimeout(() => navigate(`/groups/${id}`), 1000);
    } catch (err) {
      setMessage("Failed to add expense");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-indigo-700 mb-4">
        Add Group Expense
      </h2>
      {message && (
        <p className="text-center text-sm mb-3 text-gray-700">{message}</p>
      )}

      {!group ? (
        <p className="text-gray-500 text-center">Loading group members...</p>
      ) : (
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

          {/* Paid By Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Paid By:</label>
            <select
              name="paidBy"
              className="w-full border p-2 rounded"
              value={form.paidBy}
              onChange={handleChange}
            >
              <option value="">Select payer</option>
              {group.members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
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

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded"
          >
            Add Expense
          </button>
        </form>
      )}
    </div>
  );
}

export default AddGroupExpense;
