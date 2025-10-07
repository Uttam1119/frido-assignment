import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchGroupDetails,
  fetchGroupExpenses,
  fetchGroupBalances,
  deleteGroupExpense,
  updateGroupExpense,
} from "../api.js";

function GroupDetails({ token }) {
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

  // Fetch all group data
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

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (err) return <p className="text-red-500">{err}</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-indigo-700">{group?.name}</h2>
        <Link
          to={`/groups/${id}/add`}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          + Add Expense
        </Link>
      </div>

      {/* Members */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Members</h3>
        <ul className="list-disc ml-5 text-gray-700">
          {group?.members.map((m) => (
            <li key={String(m._id)}>{m.name || "Unknown"}</li>
          ))}
        </ul>
      </div>

      {/* Group Expenses */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Group Expenses</h3>

        {/* Expenses List */}
        {expenses.length === 0 ? (
          <p className="text-gray-500">No expenses in this group yet.</p>
        ) : (
          <ul className="space-y-3">
            {expenses.map((e) => (
              <div key={String(e._id)} className="flex flex-col border-b pb-2">
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
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(e._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Inline Edit Form */}
                {editingExpense?._id === e._id && (
                  <form
                    onSubmit={handleUpdateExpense}
                    className="bg-gray-100 p-4 rounded mt-2"
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
                      className="border p-2 rounded mb-2 w-full"
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
                      className="border p-2 rounded mb-2 w-full"
                      placeholder="Total Amount"
                      required
                    />

                    {editingExpense.splitType !== "equal" && (
                      <div className="mb-2">
                        <h4 className="font-semibold mb-1">
                          Split Details ({editingExpense.splitType})
                        </h4>
                        {editingExpense.splitDetails.map((s, idx) => {
                          const member = group.members.find(
                            (m) =>
                              String(m._id) === String(s.userId._id || s.userId)
                          );
                          const name = member?.name || "Unknown";

                          return (
                            <div
                              key={String(s.userId._id || s.userId)}
                              className="flex gap-2 items-center mb-1"
                            >
                              <span className="w-24">{name}</span>
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
                                className="border p-1 rounded w-20"
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
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingExpense(null)}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
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
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Balances</h3>
          <ul className="space-y-1 text-gray-700">
            {Object.entries(balancesData.balances).map(([userId, balance]) => {
              const member = group.members.find(
                (m) => String(m._id) === String(userId)
              );
              const name = member?.name || userId;
              return (
                <li key={String(userId)}>
                  {name}:{" "}
                  {balance >= 0
                    ? `Owes ₹0, gets ₹${balance}`
                    : `Owes ₹${-balance}`}
                </li>
              );
            })}
          </ul>

          <h3 className="text-lg font-semibold mt-4 mb-2">Settlements</h3>
          <ul className="space-y-1 text-gray-700">
            {balancesData.settlements.map((s, idx) => {
              const fromMember = group.members.find(
                (m) => String(m._id) === String(s.from)
              );
              const toMember = group.members.find(
                (m) => String(m._id) === String(s.to)
              );
              const fromName = fromMember?.name || s.from;
              const toName = toMember?.name || s.to;
              return (
                <li key={idx}>
                  {fromName} pays {toName} ₹{s.amount}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default GroupDetails;
