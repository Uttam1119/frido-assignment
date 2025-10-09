import React, { useEffect, useState, useContext } from "react";
import { fetchBalances, fetchUsers } from "../api.js";
import { AuthContext } from "../context/authContext.jsx";

function Balances() {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState({ balances: {}, settlements: [] });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

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
  }, [token]);

  const getName = (id) => {
    const user = users.find((u) => u._id === id);
    return user ? user.name : id;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center py-10 px-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-8">
          Balances & Settlements{" "}
        </h2>
        {loading && <p className="text-gray-500 text-center">Loading...</p>}
        {err && (
          <p className="text-red-500 text-center font-medium bg-red-50 rounded p-2">
            {err}
          </p>
        )}
        {!loading && !err && (
          <div className="space-y-8">
            {/* Net Balances */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 border-b pb-1">
                💰 Net Balances
              </h3>
              <ul className="space-y-3">
                {Object.keys(data.balances).length === 0 && (
                  <li className="text-gray-500 italic">No balances yet.</li>
                )}
                {Object.entries(data.balances).map(([userId, bal]) => (
                  <li
                    key={userId}
                    className={`flex justify-between items-center p-3 rounded-lg shadow-sm ${
                      bal >= 0
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <span className="font-medium text-gray-800">
                      {getName(userId)}
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
            </div>

            {/* Suggested Settlements */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 border-b pb-1">
                🔄 Suggested Settlements
              </h3>
              {data.settlements.length === 0 ? (
                <p className="text-gray-500 italic">
                  No settlements suggested.
                </p>
              ) : (
                <ul className="space-y-3">
                  {data.settlements.map((s, idx) => (
                    <li
                      key={idx}
                      className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm flex justify-between items-center"
                    >
                      <span className="font-medium text-gray-800">
                        {getName(s.from)} → {getName(s.to)}
                      </span>
                      <span className="font-semibold text-indigo-700">
                        ₹{s.amount}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Balances;
