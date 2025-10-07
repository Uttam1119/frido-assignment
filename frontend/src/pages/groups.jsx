import React, { useEffect, useState } from "react";
import { fetchGroups } from "../api.js";
import { Link } from "react-router-dom";

function Groups({ token }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        const data = await fetchGroups(token);
        setGroups(data);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    };
    loadGroups();
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-indigo-700">My Groups</h2>

      {loading && <p className="text-gray-500">Loading groups...</p>}
      {err && <p className="text-red-500">{err}</p>}
      {!loading && groups.length === 0 && (
        <p className="text-gray-500">You are not part of any group yet.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {groups.map((g) => (
          <Link
            key={g._id}
            to={`/groups/${g._id}`}
            className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-gray-800">{g.name}</h3>
            <p className="text-sm text-gray-500">
              Members: {g.members?.length || 0}
            </p>
          </Link>
        ))}
      </div>
      <div className="mt-4">
        <Link
          to="/groups/create"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
        >
          + Create New Group
        </Link>
      </div>
    </div>
  );
}

export default Groups;
