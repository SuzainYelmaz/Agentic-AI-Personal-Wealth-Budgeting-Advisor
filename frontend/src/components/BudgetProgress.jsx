import AnimatedCard from "./AnimatedCard";
import { formatCurrency, getStatusLabel } from "../utils/formatters";

function getBarClass(percentage) {
  if (percentage >= 100) return "budget-bar-fill danger";
  if (percentage >= 80) return "budget-bar-fill warning";
  return "budget-bar-fill";
}

function BudgetItem({ item }) {
  const width = Math.min(item.percentage_used, 120);
  return (
    <div className="budget-item">
      <div className="budget-item-header">
        <span className="budget-category">{item.category}</span>
        <div className="flex items-center gap-sm">
          <span className="budget-amounts">
            {formatCurrency(item.total_spent)} / {formatCurrency(item.budget_limit)}
          </span>
          <span className={`budget-status ${item.status}`}>{getStatusLabel(item.status)}</span>
        </div>
      </div>
      <div className="budget-bar-bg">
        <div className={getBarClass(item.percentage_used)} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export default function BudgetProgress({ data = [] }) {
  return (
    <AnimatedCard index={6}>
      <div className="card-header">
        <h3 className="card-title">Budget Progress</h3>
      </div>
      <div className="budget-list">
        {data.map((item) => <BudgetItem key={item.category} item={item} />)}
        {!data.length && <p className="text-sm text-muted text-center">No budget data yet</p>}
      </div>
    </AnimatedCard>
  );
}
