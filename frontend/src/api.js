const API_BASE = import.meta.env.VITE_API_URL;

export async function fetchExpenses() {
  const res = await fetch(`${API_BASE}`);
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}

export async function createExpense(data) {
  const res = await fetch(`${API_BASE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create expense");
  }
  return res.json();
}

export async function deleteExpense(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete expense");
  return res.json();
}

export async function fetchBalances() {
  // const base = API_BASE.replace(//expenses$/, '/expenses')
  const res = await fetch(`${API_BASE}` + "/balances");
  if (!res.ok) throw new Error("Failed to fetch balances");
  return res.json();
}
