import React, { useEffect, useState } from "react";
import { fetchExpenses, deleteExpense } from "../api.js";

function Home() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await deleteExpense(id);
      setExpenses(expenses.filter((e) => e._id !== id));
    } catch (e) {
      alert("Failed to delete expense", e);
    }
  };

  return (
    <div>
      {" "}
      <h2>All Expenses</h2>{" "}
      <div className="card">
        {loading ? <p className="small">Loading...</p> : null}
        {err ? (
          <p className="small" style={{ color: "red" }}>
            {err}{" "}
          </p>
        ) : null}
        {expenses.length === 0 && !loading ? (
          <p className="small">No expenses yet. Add one.</p>
        ) : null}

        {expenses.map((exp) => (
          <div key={exp._id} className="expense-item">
            <div>
              <div style={{ fontWeight: 600 }}>
                {exp.description} — ₹{exp.amount}
              </div>
              <div className="small">
                Paid by: {exp.paidBy} • Participants:{" "}
                {exp.participants.join(", ")} •{" "}
                {new Date(exp.date).toLocaleDateString()}
              </div>
            </div>
            <div>
              <button
                className="btn btn-danger"
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
