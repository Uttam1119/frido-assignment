import React, { useEffect, useState } from "react";
import { fetchBalances } from "../api.js";

function Balances() {
  const [data, setData] = useState({ balances: {}, settlements: [] });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const d = await fetchBalances();
        setData(d);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      {" "}
      <h2>Balances</h2>{" "}
      <div className="card">
        {loading ? <p className="small">Loading...</p> : null}
        {err ? (
          <p className="small" style={{ color: "red" }}>
            {err}{" "}
          </p>
        ) : null}

        <h3>Net Balances</h3>
        <ul>
          {Object.keys(data.balances).length === 0 ? (
            <li className="small">No balances yet.</li>
          ) : null}
          {Object.entries(data.balances).map(([user, bal]) => (
            <li key={user} className="small">
              {user}:{" "}
              {bal >= 0 ? `should receive ₹${bal}` : `owes ₹${Math.abs(bal)}`}
            </li>
          ))}
        </ul>

        <h3>Suggested Settlements</h3>
        {data.settlements.length === 0 ? (
          <p className="small">No settlements suggested.</p>
        ) : null}
        <ul>
          {data.settlements.map((s, idx) => (
            <li key={idx} className="small">
              {s.from} → {s.to} : ₹{s.amount}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Balances;
