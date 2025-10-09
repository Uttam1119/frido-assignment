import React, { useState, useEffect, useContext } from "react";
import { createGroup, fetchUsers } from "../api.js";
import { AuthContext } from "../context/authContext.jsx";
import { useNavigate } from "react-router-dom";

function CreateGroup() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch all users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers(token);
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setMessage("❌ Failed to load users");
      }
    };
    loadUsers();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage("⚠️ Group name is required");
      return;
    }

    try {
      setLoading(true);
      await createGroup({ name, members: selectedMembers }, token);
      setMessage("✅ Group created successfully!");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setMessage("❌ Failed to create group: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8">
        <h2 className="text-2xl font-extrabold text-center text-indigo-700 mb-6">
          Create New Group
        </h2>

        {message && (
          <p
            className={`text-center text-sm mb-4 ${
              message.includes("✅")
                ? "text-green-600"
                : message.includes("⚠️")
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Group Name
            </label>
            <input
              type="text"
              placeholder="Enter group name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg p-2.5 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Select Members
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2 space-y-1">
              {users.map((user) => (
                <label
                  key={user._id}
                  className="flex items-center space-x-2 p-1 rounded-md hover:bg-indigo-50 transition cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={user._id}
                    checked={selectedMembers.includes(user._id)}
                    onChange={() => handleCheckboxChange(user._id)}
                    className="w-4 h-4 accent-indigo-600"
                  />
                  <span className="text-gray-700 font-medium text-sm">
                    {user.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium shadow-md transition"
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateGroup;
