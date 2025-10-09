import React, { useEffect, useState, useContext } from "react";
import {
  fetchExpenses,
  deleteExpense,
  fetchUsers,
  fetchGroups,
} from "../api.js";
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
        fetchGroups(token),
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
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (e) {
      alert("Failed to delete expense", e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="bg-white shadow p-4 rounded-lg flex justify-between items-center">
          <h2 className="text-3xl font-extrabold text-indigo-700 tracking-tight">
            Dashboard
          </h2>
        </div>
        {/* All Expenses Section */}
        <section>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
            All Expenses
          </h3>

          {loading && (
            <p className="text-center text-gray-500 text-sm">Loading...</p>
          )}
          {err && <p className="text-center text-red-500 text-sm">{err}</p>}
          {!loading && expenses.length === 0 && (
            <p className="text-center text-gray-500 text-sm">
              No expenses yet. Add one to get started.
            </p>
          )}

          <div className="grid gap-5">
            {expenses.map((exp) => (
              <div
                key={exp._id}
                className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 flex justify-between items-start"
              >
                <div>
                  <div className="font-semibold text-gray-800 text-lg">
                    {exp.description} —{" "}
                    <span className="text-indigo-600">₹{exp.amount}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Paid by:{" "}
                    <span className="font-medium text-gray-800">
                      {getName(exp.paidBy)}
                    </span>
                    • Participants:
                    <span className="font-medium">
                      {exp.participants.map(getName).join(", ")}
                    </span>
                    • {new Date(exp.date).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(exp._id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-md shadow-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
