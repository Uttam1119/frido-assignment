import React, { useState } from "react";
import { createExpense } from "../api.js";
import { useNavigate } from "react-router-dom";

function AddExpense() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [participantsText, setParticipantsText] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const participants = participantsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!description || !amount || !paidBy || participants.length === 0) {
      setError(
        "All fields are required and participants must be comma-separated names."
      );
      return;
    }

    try {
      await createExpense({
        description,
        amount: Number(amount),
        paidBy,
        participants,
        date: new Date(),
      });
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {" "}
      <h2>Add Expense</h2>{" "}
      <div className="card">
        {" "}
        <form onSubmit={handleSubmit}>
          {" "}
          <div className="form-row">
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              type="number"
            />{" "}
          </div>
          <div className="form-row">
            <input
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              placeholder="Paid by (name)"
            />
            <input
              value={participantsText}
              onChange={(e) => setParticipantsText(e.target.value)}
              placeholder="Participants (comma separated)"
            />
          </div>
          {error ? (
            <div style={{ color: "red", marginBottom: 10 }}>{error}</div>
          ) : null}
          <button className="btn" type="submit">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddExpense;
