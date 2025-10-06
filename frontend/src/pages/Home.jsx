import React, { useEffect, useState, useContext } from "react";
import { fetchExpenses, deleteExpense, fetchUsers } from "../api.js";
import { AuthContext } from "../context/authContext.jsx";

function Home() {
  const { token } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const [expensesData, usersData] = await Promise.all([
        fetchExpenses(token),
        fetchUsers(token),
      ]);
      setExpenses(expensesData);
      setUsers(usersData);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const getName = (id) => {
    const user = users.find((u) => u._id === id);
    return user ? user.name : id;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await deleteExpense(id, token);
      setExpenses(expenses.filter((e) => e._id !== id));
    } catch (e) {
      alert("Failed to delete expense", e);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Expenses</h2>
      <div className="space-y-4">
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {err && <p className="text-sm text-red-500">{err}</p>}
        {!loading && expenses.length === 0 && (
          <p className="text-sm text-gray-500">No expenses yet. Add one.</p>
        )}

        {expenses.map((exp) => (
          <div
            key={exp._id}
            className="bg-white shadow-sm rounded-lg p-4 flex justify-between items-start"
          >
            <div>
              <div className="font-semibold text-gray-800 text-lg">
                {exp.description} — ₹{exp.amount}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Paid by:{" "}
                <span className="font-medium">{getName(exp.paidBy)}</span> •
                Participants: {exp.participants.map(getName).join(", ")} •{" "}
                {new Date(exp.date).toLocaleDateString()}
              </div>
            </div>
            <div>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(exp._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
