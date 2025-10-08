import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export async function fetchExpenses() {
  try {
    const res = await axios.get(`${API_BASE}/expenses`);
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch expenses"
    );
  }
}

export async function createExpense(data, token) {
  try {
    const res = await axios.post(`${API_BASE}/expenses`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data; // Axios automatically parses JSON
  } catch (error) {
    // Extract backend error message or fallback
    const msg = error.response?.data?.message || "Failed to create expense";
    throw new Error(msg);
  }
}

export async function deleteExpense(id) {
  try {
    const res = await axios.delete(`${API_BASE}/expenses/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete expense"
    );
  }
}

export async function fetchBalances() {
  try {
    const res = await axios.get(`${API_BASE}/expenses/balances`);
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch balances"
    );
  }
}

export async function fetchUsers(token) {
  try {
    const res = await axios.get(`${API_BASE}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new error(
      error.response?.data?.message || "Failed to fetch all users"
    );
  }
}

// GROUPS
export const fetchGroups = async (token) => {
  try {
    const res = await axios.get(`${API_BASE}/group`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new error(error.response?.data?.message || "Failed to fetch groups");
  }
};

export const createGroup = async (data, token) => {
  // const res = await fetch(`${import.meta.env.VITE_API_URL}/group`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //   },
  //   body: JSON.stringify(data),
  // });
  // if (!res.ok) throw new Error("Failed to create group");
  // return res.json();

  try {
    const res = await axios.post(`${API_BASE}/group`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    throw new error(
      error.response?.data?.message || "Failed to create a group"
    );
  }
};

export const fetchGroupDetails = async (id, token) => {
  try {
    const res = await axios.get(`${API_BASE}/group/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new error(
      error.response?.data?.message || "Failed to fetch group details"
    );
  }
};

export const fetchGroupExpenses = async (groupId, token) => {
  try {
    const res = await axios.get(`${API_BASE}/group/expenses/${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new error(
      error.response?.data?.message || "Failed to fetch group expenses"
    );
  }
};

export const createGroupExpense = async (data, token) => {
  try {
    const res = await axios.post(
      `${API_BASE}/group/expenses/${data.groupId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    throw new error(
      error.response?.data?.message || "Failed to create group expense"
    );
  }
};

export const fetchGroupBalances = async (groupId, token) => {
  try {
    const res = await axios.get(`${API_BASE}/group/balances/${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    throw new error(
      error.response?.data?.message || "Failed to fetch group balances"
    );
  }
};

export const deleteGroupExpense = async (id, token) => {
  try {
    const res = await axios.delete(`${API_BASE}/group/expenses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new error(
      error.response?.data?.message || "Failed to delete a group expense"
    );
  }
};

export const updateGroupExpense = async (id, expenseData, token) => {
  try {
    const res = await axios.put(
      `${API_BASE}/group/expenses/${id}`,
      expenseData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    throw new error(
      error.response?.data?.message || "Failed to update group expense"
    );
  }
};
