import React, { useEffect, useState, useContext } from "react";
import { fetchBalances, fetchUsers } from "../api.js";
import { AuthContext } from "../context/authContext.jsx";

function Balances() {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState({ balances: {}, settlements: [] });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // fetch balances and users
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [balancesData, usersData] = await Promise.all([
          fetchBalances(),
          fetchUsers(token),
        ]);
        setData(balancesData);
        setUsers(usersData);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // helper to get user name from ID
  const getName = (id) => {
    const user = users.find((u) => u._id === id);
    return user ? user.name : id;
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">
        Balances
      </h2>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
        {loading && <p className="text-gray-500 text-center">Loading...</p>}
        {err && <p className="text-red-500 text-center font-medium">{err}</p>}

        {/* Net Balances */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-700">
            Net Balances
          </h3>
          <ul className="space-y-2">
            {Object.keys(data.balances).length === 0 && (
              <li className="text-gray-500">No balances yet.</li>
            )}
            {Object.entries(data.balances).map(([userId, bal]) => (
              <li
                key={userId}
                className={`p-2 rounded ${
                  bal >= 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <span className="font-medium">{getName(userId)}</span>:{" "}
                {bal >= 0 ? `should receive ₹${bal}` : `owes ₹${Math.abs(bal)}`}
              </li>
            ))}
          </ul>
        </div>

        {/* Suggested Settlements */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-700">
            Suggested Settlements
          </h3>
          {data.settlements.length === 0 ? (
            <p className="text-gray-500">No settlements suggested.</p>
          ) : (
            <ul className="space-y-2">
              {data.settlements.map((s, idx) => (
                <li
                  key={idx}
                  className="p-2 bg-indigo-50 rounded text-indigo-800 font-medium"
                >
                  {getName(s.from)} → {getName(s.to)} : ₹{s.amount}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Balances;
