// import React, { useState } from "react";
// import { createExpense } from "../api.js";
// import { useNavigate } from "react-router-dom";

// function AddExpense() {
//   const [description, setDescription] = useState("");
//   const [amount, setAmount] = useState("");
//   const [paidBy, setPaidBy] = useState("");
//   const [participantsText, setParticipantsText] = useState("");
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     const participants = participantsText
//       .split(",")
//       .map((s) => s.trim())
//       .filter(Boolean);

//     if (!description || !amount || !paidBy || participants.length === 0) {
//       setError(
//         "All fields are required and participants must be comma-separated names."
//       );
//       return;
//     }

//     try {
//       await createExpense({
//         description,
//         amount: Number(amount),
//         paidBy,
//         participants,
//         date: new Date(),
//       });
//       navigate("/");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div>
//       {" "}
//       <h2>Add Expense</h2>{" "}
//       <div className="card">
//         {" "}
//         <form onSubmit={handleSubmit}>
//           {" "}
//           <div className="form-row">
//             <input
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Description"
//             />
//             <input
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               placeholder="Amount"
//               type="number"
//             />{" "}
//           </div>
//           <div className="form-row">
//             <input
//               value={paidBy}
//               onChange={(e) => setPaidBy(e.target.value)}
//               placeholder="Paid by (name)"
//             />
//             <input
//               value={participantsText}
//               onChange={(e) => setParticipantsText(e.target.value)}
//               placeholder="Participants (comma separated)"
//             />
//           </div>
//           {error ? (
//             <div style={{ color: "red", marginBottom: 10 }}>{error}</div>
//           ) : null}
//           <button className="btn" type="submit">
//             Add
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddExpense;

// import React, { useEffect, useState } from "react";
// import { createExpense, fetchUsers } from "../api";

// function AddExpense({ token }) {
//   const [users, setUsers] = useState([]);
//   const [selectedParticipants, setSelectedParticipants] = useState([]);
//   const [description, setDescription] = useState("");
//   const [amount, setAmount] = useState("");

//   useEffect(() => {
//     console.log("Token being sent:", token);
//     fetchUsers(token)
//       .then((data) => {
//         console.log("Fetched users:", data);
//         setUsers(data);
//         console.log(users);
//       })
//       .catch((err) => console.error("Error fetching users:", err));
//   }, [token]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await createExpense({
//       description,
//       amount,
//       paidBy: token.userId, // or however you're storing it
//       participants: selectedParticipants,
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//         placeholder="Description"
//       />
//       <input
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//         placeholder="Amount"
//       />

//       <h4>Select Participants</h4>
//       {users.map((user) => (
//         <label key={user._id}>
//           <input
//             type="checkbox"
//             value={user._id}
//             checked={selectedParticipants.includes(user._id)}
//             onChange={(e) => {
//               if (e.target.checked) {
//                 setSelectedParticipants([...selectedParticipants, user._id]);
//               } else {
//                 setSelectedParticipants(
//                   selectedParticipants.filter((id) => id !== user._id)
//                 );
//               }
//             }}
//           />
//           {user.name}
//         </label>
//       ))}

//       <button type="submit">Add Expense</button>
//     </form>
//   );
// }

// export default AddExpense;

import React, { useEffect, useState } from "react";
import { createExpense, fetchUsers } from "../api";

function AddExpense({ token, currentUserId }) {
  const [users, setUsers] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers(token)
      .then((data) => {
        setUsers(data);
        if (currentUserId && data.some((u) => u._id === currentUserId)) {
          setPaidBy(currentUserId); // set to a valid ID
        } else if (data.length > 0) {
          setPaidBy(data[0]._id); // fallback: first user in list
        }
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, [token, currentUserId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !description ||
      !amount ||
      !paidBy ||
      selectedParticipants.length === 0
    ) {
      setMessage("Please fill all fields and select participants.");
      return;
    }

    try {
      const newExpense = await createExpense(
        {
          description,
          amount: Number(amount),
          paidBy,
          participants: selectedParticipants,
        },
        token
      );

      console.log("Expense created:", newExpense);
      setMessage("Expense added successfully!");
      setDescription("");
      setAmount("");
      setSelectedParticipants([]);
      setPaidBy(currentUserId);
    } catch (err) {
      console.error("Error creating expense:", err);
      setMessage("Failed to add expense.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>

      {message && (
        <p className="text-center text-sm text-gray-700 mb-3">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <input
          className="w-full border p-2 rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          type="number"
        />

        <div>
          <label className="block text-sm font-medium mb-1">Paid By:</label>
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="" disabled>
              Select payer
            </option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Select Participants:</h4>
          {users.map((user) => (
            <label key={user._id} className="block">
              <input
                type="checkbox"
                value={user._id}
                checked={selectedParticipants.includes(user._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedParticipants([
                      ...selectedParticipants,
                      user._id,
                    ]);
                  } else {
                    setSelectedParticipants(
                      selectedParticipants.filter((id) => id !== user._id)
                    );
                  }
                }}
              />{" "}
              {user.name}
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded w-full hover:bg-indigo-700"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}

export default AddExpense;
