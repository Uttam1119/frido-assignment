const API_BASE = import.meta.env.VITE_API_URL;

export async function fetchExpenses() {
  const res = await fetch(`${API_BASE}/expenses`);
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}

// export async function createExpense(data) {
//   const res = await fetch(`${API_BASE}/expenses`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err.message || "Failed to create expense");
//   }
//   return res.json();
// }

export async function createExpense(data, token) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create expense");
  }
  return res.json();
}

export async function deleteExpense(id) {
  const res = await fetch(`${API_BASE}/expenses/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete expense");
  return res.json();
}

export async function fetchBalances() {
  // const base = API_BASE.replace(//expenses$/, '/expenses')
  const res = await fetch(`${API_BASE}` + "/expenses/balances");
  if (!res.ok) throw new Error("Failed to fetch balances");
  return res.json();
}

export async function authedFetch(url, method = "GET", body, token) {
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export async function fetchUsers(token) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}
