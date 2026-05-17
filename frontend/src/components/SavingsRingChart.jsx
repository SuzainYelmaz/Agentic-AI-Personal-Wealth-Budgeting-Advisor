import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import AnimatedCard from "./AnimatedCard";
import { formatCurrency } from "../utils/formatters";

const RING_COLORS = ["#1C1B19", "#E7E5E4"];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-stone-900 text-stone-50 px-3 py-2 rounded-lg shadow-md text-xs border border-stone-800">
      <strong>{payload[0].name}</strong>
      <div className="font-semibold mt-0.5">{formatCurrency(payload[0].value)}</div>
    </div>
  );
}

export default function SavingsRingChart({ totalIncome = 0, totalSpent = 0 }) {
  const savings = Math.max(0, totalIncome - totalSpent);
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

  const data = [
    { name: "Savings",  value: savings },
    { name: "Spent",    value: totalSpent },
  ];

  return (
    <AnimatedCard index={3} className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-xl font-semibold text-stone-900">Savings Rate</h3>
        <span className={`font-sans text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
          savingsRate >= 20 ? "bg-stone-900 text-stone-50" :
          savingsRate >= 10 ? "bg-amber-100 text-amber-800" :
                              "bg-red-100 text-red-800"
        }`}>
          {savingsRate >= 20 ? "Great" : savingsRate >= 10 ? "Fair" : "Low"}
        </span>
      </div>

      <div className="relative h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={68} outerRadius={95}
              paddingAngle={2}
              dataKey="value"
              startAngle={90} endAngle={-270}
              animationBegin={300} animationDuration={1200}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={RING_COLORS[i]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Centre label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-serif text-4xl font-semibold text-stone-900">{savingsRate}%</span>
          <span className="font-sans text-xs text-stone-500 uppercase tracking-widest mt-1">saved</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {[
          { label: "Saved", value: savings,     color: "#1C1B19" },
          { label: "Spent", value: totalSpent,  color: "#E7E5E4" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: color }} />
            <div>
              <p className="font-sans text-xs text-stone-500 uppercase tracking-wider">{label}</p>
              <p className="font-sans text-sm font-semibold text-stone-900">{formatCurrency(value)}</p>
            </div>
          </div>
        ))}
      </div>
    </AnimatedCard>
  );
}
