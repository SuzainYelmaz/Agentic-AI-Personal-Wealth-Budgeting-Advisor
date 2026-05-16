const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("access_token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  if (!res.ok) throw new Error((await res.json()).detail || res.statusText);
  return res.json();
}

export const api = {
  getTransactions: (year, month) => apiFetch(`/transactions/?year=${year}&month=${month}`),
  createTransaction: (data) => apiFetch("/transactions/", { method: "POST", body: JSON.stringify(data) }),
  deleteTransaction: (id) => apiFetch(`/transactions/${id}`, { method: "DELETE" }),
  getBudgetGoals: () => apiFetch("/budgets/"),
  createBudgetGoal: (data) => apiFetch("/budgets/", { method: "POST", body: JSON.stringify(data) }),
  updateBudgetGoal: (id, data) => apiFetch(`/budgets/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteBudgetGoal: (id) => apiFetch(`/budgets/${id}`, { method: "DELETE" }),
  runAdvisor: (year, month) => apiFetch("/advisor/analyze", { method: "POST", body: JSON.stringify({ year, month }) }),
  chatWithAdvisor: (message, year, month) => apiFetch("/advisor/chat", { method: "POST", body: JSON.stringify({ message, year, month }) }),
};
