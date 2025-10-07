import React, { useState, useEffect } from "react";
import { createGroup, fetchUsers } from "../api.js";
import { AuthContext } from "../context/authContext.jsx";
import { useNavigate } from "react-router-dom";

function CreateGroup(token) {
  // const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Fetch all users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers(token);
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    loadUsers();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Group name is required");

    try {
      setLoading(true);
      await createGroup({ name, members: selectedMembers }, token);
      navigate("/"); // Back to home
    } catch (err) {
      alert("Failed to create group: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (userId) => {
    setSelectedMembers(
      (prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId) // uncheck
          : [...prev, userId] // check
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow mt-10">
      <h2 className="text-xl font-bold text-indigo-700 mb-4">
        Create New Group
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* Checkbox for selecting members */}
        <div>
          <label className="block mb-2 font-medium">Select Members:</label>
          <div className="space-y-1 max-h-40 overflow-y-auto border p-2 rounded">
            {users.map((user) => (
              <label key={user._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={user._id}
                  checked={selectedMembers.includes(user._id)}
                  onChange={() => handleCheckboxChange(user._id)}
                  className="w-4 h-4"
                />
                <span>{user.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Group"}
        </button>
      </form>
    </div>
  );
}

export default CreateGroup;
