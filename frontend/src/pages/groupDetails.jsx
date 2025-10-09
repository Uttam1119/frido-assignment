import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchGroupDetails,
  fetchGroupExpenses,
  fetchGroupBalances,
  deleteGroupExpense,
  updateGroupExpense,
} from "../api.js";
import { AuthContext } from "../context/authContext.jsx";

function GroupDetails() {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [balancesData, setBalancesData] = useState({
    balances: {},
    settlements: [],
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [groupData, expenseData, balances] = await Promise.all([
        fetchGroupDetails(id, token),
        fetchGroupExpenses(id, token),
        fetchGroupBalances(id, token),
      ]);
      setGroup(groupData);
      setExpenses(expenseData);
      setBalancesData(balances);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, token]);

  const handleUpdateExpense = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...editingExpense,
        amount: Number(editingExpense.amount),
        splitDetails: editingExpense.splitDetails.map((s) => ({
          userId: s.userId,
          amount: Number(s.amount),
        })),
      };
      await updateGroupExpense(editingExpense._id, payload, token);
      setEditingExpense(null);
      await loadData();
    } catch (err) {
      alert("Failed to update expense: " + err.message);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;

    try {
      await deleteGroupExpense(expenseId, token);
      await loadData();
    } catch (err) {
      alert("Failed to delete expense: " + err.message);
    }
  };

  const getMemberName = (userId) => {
    const member = group?.members.find((m) => String(m._id) === String(userId));
    return member?.name || userId;
  };

  if (loading)
    return (
      <p className="text-gray-500 text-center mt-10">
        Loading group details...
      </p>
    );
  if (err)
    return <p className="text-red-500 text-center mt-10 font-medium">{err}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-extrabold text-indigo-700">
            {group?.name}
          </h2>
          <Link
            to={`/groups/${id}/add`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Expense
          </Link>
        </div>

        {/* Members */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 border-b pb-1">
            Members
          </h3>
          <ul className="list-disc ml-5 text-gray-700 space-y-1">
            {group?.members.map((m) => (
              <li key={String(m._id)}>{m.name || "Unknown"}</li>
            ))}
          </ul>
        </div>

        {/* Group Expenses */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 border-b pb-1">
            Group Expenses
          </h3>

          {expenses.length === 0 ? (
            <p className="text-gray-500 italic">
              No expenses in this group yet.
            </p>
          ) : (
            <ul className="space-y-4">
              {expenses.map((e) => (
                <div
                  key={String(e._id)}
                  className="flex flex-col border-b pb-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-800">
                        {e.description} — ₹{e.amount}{" "}
                        <span className="text-sm text-gray-500">
                          ({e.splitType})
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Paid by: {e.paidBy?.name || "Unknown"} •{" "}
                        {new Date(e.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setEditingExpense(
                            editingExpense?._id === e._id ? null : e
                          )
                        }
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(e._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Inline Edit Form */}
                  {editingExpense?._id === e._id && (
                    <form
                      onSubmit={handleUpdateExpense}
                      className="bg-gray-50 p-4 rounded-lg mt-3 space-y-2"
                    >
                      <input
                        type="text"
                        value={editingExpense.description}
                        onChange={(ev) =>
                          setEditingExpense({
                            ...editingExpense,
                            description: ev.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="Description"
                        required
                      />
                      <input
                        type="number"
                        value={editingExpense.amount}
                        onChange={(ev) =>
                          setEditingExpense({
                            ...editingExpense,
                            amount: ev.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="Total Amount"
                        required
                      />

                      {editingExpense.splitType !== "equal" && (
                        <div>
                          <h4 className="font-semibold mb-2">
                            Split Details ({editingExpense.splitType})
                          </h4>
                          {editingExpense.splitDetails.map((s, idx) => {
                            const name = getMemberName(
                              s.userId._id || s.userId
                            );
                            return (
                              <div
                                key={String(s.userId._id || s.userId)}
                                className="flex gap-2 items-center mb-1"
                              >
                                <span className="w-24 text-gray-700">
                                  {name}
                                </span>
                                <input
                                  type="number"
                                  value={s.amount}
                                  onChange={(ev) => {
                                    const newSplits = [
                                      ...editingExpense.splitDetails,
                                    ];
                                    newSplits[idx].amount = ev.target.value;
                                    setEditingExpense({
                                      ...editingExpense,
                                      splitDetails: newSplits,
                                    });
                                  }}
                                  className="border p-1 rounded w-20 outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                                  placeholder={
                                    editingExpense.splitType === "percentage"
                                      ? "%"
                                      : "Amount"
                                  }
                                  required
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition"
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingExpense(null)}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg shadow transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ))}
            </ul>
          )}
        </div>

        {/* Balances & Settlements */}
        {expenses.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
              💰 Balances
            </h3>

            {/* Net Balances */}
            <ul className="space-y-3 mb-6">
              {Object.keys(balancesData.balances).length === 0 && (
                <li className="text-gray-500 italic">No balances yet.</li>
              )}
              {Object.entries(balancesData.balances).map(([userId, bal]) => (
                <li
                  key={userId}
                  className={`flex justify-between items-center p-3 rounded-lg shadow-sm ${
                    bal >= 0
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <span className="font-medium text-gray-800">
                    {getMemberName(userId)}
                  </span>
                  <span
                    className={`font-semibold ${
                      bal >= 0 ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {bal >= 0 ? `Receives ₹${bal}` : `Owes ₹${Math.abs(bal)}`}
                  </span>
                </li>
              ))}
            </ul>

            {/* Suggested Settlements */}
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
              🔄 Suggested Settlements
            </h3>
            {balancesData.settlements.length === 0 ? (
              <p className="text-gray-500 italic">No settlements suggested.</p>
            ) : (
              <ul className="space-y-3">
                {balancesData.settlements.map((s, idx) => (
                  <li
                    key={idx}
                    className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-800">
                      {getMemberName(s.from)} → {getMemberName(s.to)}
                    </span>
                    <span className="font-semibold text-indigo-700">
                      ₹{s.amount}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default GroupDetails;
