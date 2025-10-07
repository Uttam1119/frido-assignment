const API_BASE = import.meta.env.VITE_API_URL;

export async function fetchExpenses() {
  const res = await fetch(`${API_BASE}/expenses`);
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}

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

// GROUPS
export const fetchGroups = async (token) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/group`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch groups");
  return res.json();
};

export const createGroup = async (data, token) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/group`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create group");
  return res.json();
};

export const fetchGroupDetails = async (id, token) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/group/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch group details");
  return res.json();
};

export const fetchGroupExpenses = async (groupId, token) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/group/expenses/${groupId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch group expenses");
  return res.json();
};

export const createGroupExpense = async (data, token) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/group/expenses/${data.groupId}`, // use data.groupId here
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  const resData = await res.json();
  if (!res.ok) {
    console.error("Error response:", resData); // log backend error
    throw new Error("Failed to add group expense");
  }

  return resData;
};

export const fetchGroupBalances = async (groupId, token) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/group/balances/${groupId}`,
    {
      "Content-Type": "application/json",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch balances");
  return res.json();
};

export const deleteGroupExpense = async (id, token) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/group/expenses/${id}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error("Failed to delete expense");
  return res.json();
};

// api.js
export const updateGroupExpense = async (id, expenseData, token) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/group/expenses/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // if you are using auth
      },
      body: JSON.stringify(expenseData),
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update expense");
  }

  const data = await res.json();
  return data;
};
