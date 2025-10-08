import React, { useEffect, useState } from "react";
import { fetchGroups, deleteGroup } from "../api.js";
import { Link } from "react-router-dom";

function Groups({ token }) {
  const [myGroups, setMyGroups] = useState([]);
  const [otherGroups, setOtherGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        const { myGroups, otherGroups } = await fetchGroups(token);
        setMyGroups(myGroups);
        setOtherGroups(otherGroups);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    };
    loadGroups();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this group?")) return;
    try {
      await deleteGroup(id, token);
      setMyGroups((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      alert("Failed to delete group");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header Section */}{" "}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white shadow p-4 rounded-lg">
          <h2 className="text-3xl font-extrabold text-indigo-700 tracking-tight mb-3 sm:mb-0">
            Groups Dashboard{" "}
          </h2>
          <Link
            to="/groups/create"
            className="bg-indigo-600 hover:bg-indigo-700 transition text-white py-2 px-6 rounded-lg font-medium shadow-md"
          >
            + Create New Group{" "}
          </Link>
        </div>
        {loading && (
          <p className="text-gray-500 text-center text-lg">Loading groups...</p>
        )}
        {err && <p className="text-red-500 text-center">{err}</p>}
        {/* My Groups */}
        <section>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
            My Groups
          </h3>
          {myGroups.length === 0 ? (
            <p className="text-gray-600 bg-white p-4 rounded-lg shadow text-center">
              You haven’t created any groups yet.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myGroups.map((g) => (
                <div
                  key={g._id}
                  className="relative bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1"
                >
                  <Link to={`/groups/${g._id}`}>
                    <h3 className="text-lg font-bold text-gray-800">
                      {g.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Members: {g.members?.length || 0}
                    </p>
                  </Link>
                  <button
                    onClick={() => handleDelete(g._id)}
                    className="absolute top-3 right-3 text-xs font-medium text-red-500 hover:text-red-700"
                  >
                    ✕ Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
        {/* Other Groups */}
        <section>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-purple-500 pl-3">
            Other Groups
          </h3>
          {otherGroups.length === 0 ? (
            <p className="text-gray-600 bg-white p-4 rounded-lg shadow text-center">
              You’re not part of any other groups yet.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherGroups.map((g) => (
                <Link
                  key={g._id}
                  to={`/groups/${g._id}`}
                  className="block bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1"
                >
                  <h3 className="text-lg font-bold text-gray-800">{g.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Members: {g.members?.length || 0}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Groups;
