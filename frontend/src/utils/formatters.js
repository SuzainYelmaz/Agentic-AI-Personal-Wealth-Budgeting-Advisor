export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatPercent(value) {
  return `${Math.round(value)}%`;
}

export function getMonthName(month) {
  return new Date(2026, month - 1).toLocaleString("en-US", { month: "long" });
}

export function getStatusColor(status) {
  const colors = { under_budget: "#10b981", on_track: "#f59e0b", over_budget: "#ef4444" };
  return colors[status] || "#6b7280";
}

export function getStatusLabel(status) {
  const labels = { under_budget: "Under Budget", on_track: "On Track", over_budget: "Over Budget" };
  return labels[status] || status;
}
