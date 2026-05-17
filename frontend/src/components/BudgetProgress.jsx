import AnimatedCard from "./AnimatedCard";
import { formatCurrency, getStatusLabel } from "../utils/formatters";

function getBarClass(percentage) {
  if (percentage >= 100) return "bg-red-500";
  if (percentage >= 80) return "bg-amber-500";
  return "bg-stone-800";
}

function BudgetItem({ item }) {
  const width = Math.min(item.percentage_used, 100);
  const isOver = item.percentage_used >= 100;
  const isWarning = item.percentage_used >= 80 && !isOver;
  
  let statusClass = "text-stone-600 bg-stone-100";
  if (isOver) statusClass = "text-red-700 bg-red-50";
  else if (isWarning) statusClass = "text-amber-700 bg-amber-50";

  return (
    <div className="mb-5">
      <div className="flex justify-between items-end mb-2">
        <span className="font-sans font-semibold text-stone-900 text-sm uppercase tracking-wide">{item.category}</span>
        <div className="flex items-center gap-3">
          <span className="font-sans text-sm text-stone-500 font-medium">
            {formatCurrency(item.total_spent)} / {formatCurrency(item.budget_limit)}
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${statusClass}`}>
            {getStatusLabel(item.status)}
          </span>
        </div>
      </div>
      <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ease-out ${getBarClass(item.percentage_used)}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export default function BudgetProgress({ data = [] }) {
  return (
    <AnimatedCard index={6}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-xl font-semibold text-stone-900">Budget Progress</h3>
      </div>
      <div className="space-y-2">
        {data.map((item) => <BudgetItem key={item.category} item={item} />)}
        {!data.length && (
          <div className="text-center py-10 px-6">
            <h3 className="font-serif italic text-xl text-stone-800 mb-2">No budget data</h3>
            <p className="font-sans text-stone-500 text-sm">Set budget goals and run analysis to track your progress</p>
          </div>
        )}
      </div>
    </AnimatedCard>
  );
}
