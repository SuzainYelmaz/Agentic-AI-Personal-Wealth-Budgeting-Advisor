import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Legend,
} from "recharts";
import AnimatedCard from "./AnimatedCard";
import { formatCurrency } from "../utils/formatters";

const CHART_COLORS = ["#1C1B19","#2C2B29","#44403C","#57534E","#78716C","#A8A29E","#D6D3D1","#E7E5E4"];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-stone-900 text-stone-50 px-3 py-2.5 rounded-lg shadow-md text-sm border border-stone-800">
      <strong className="font-sans font-medium">{payload[0].name || payload[0].payload?.category}</strong>
      <div className="font-sans font-semibold mt-1">
        {formatCurrency(payload[0].value)}
      </div>
    </div>
  );
}

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-stone-900 text-stone-50 px-4 py-3 rounded-xl shadow-xl text-sm border border-stone-800 space-y-1.5">
      <div className="font-sans font-semibold text-stone-300 uppercase tracking-wider text-[10px] mb-2">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: p.fill }} />
          <span className="font-sans text-stone-300 text-xs">{p.name}:</span>
          <span className="font-sans font-semibold">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function SpendingPieChart({ data = [] }) {
  const chartData = data.map((d) => ({ name: d.category, value: d.total_spent }));

  return (
    <AnimatedCard index={4} className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-xl font-semibold text-stone-900">Spending Breakdown</h3>
      </div>
      {chartData.length ? (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={115}
                paddingAngle={3} dataKey="value" animationBegin={200} animationDuration={1000}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-12 px-6">
          <h3 className="font-serif italic text-xl text-stone-800 mb-2">No spending data</h3>
          <p className="font-sans text-stone-500 text-sm">Add transactions and run analysis to see your breakdown</p>
        </div>
      )}
    </AnimatedCard>
  );
}

export function SpendingAreaChart({ transactions = [] }) {
  const dailyData = transactions.reduce((acc, t) => {
    const day = new Date(t.transaction_date).getDate();
    const existing = acc.find((d) => d.day === day);
    if (existing) existing.amount += t.amount;
    else acc.push({ day, amount: t.amount });
    return acc;
  }, []).sort((a, b) => a.day - b.day);

  let running = 0;
  const cumulativeData = dailyData.map((d) => {
    running += d.amount;
    return { ...d, cumulative: running };
  });

  return (
    <AnimatedCard index={5} className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-xl font-semibold text-stone-900">Spending Trend</h3>
      </div>
      {cumulativeData.length ? (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cumulativeData}>
              <defs>
                <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1C1B19" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#1C1B19" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(28, 27, 25, 0.1)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#78716C", fontFamily: "var(--font-sans)" }} axisLine={false} tickLine={false} tickMargin={10} />
              <YAxis tick={{ fontSize: 12, fill: "#78716C", fontFamily: "var(--font-sans)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} tickMargin={10} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cumulative" stroke="#1C1B19" strokeWidth={2.5}
                fill="url(#gradientArea)" animationDuration={1200} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-12 px-6">
          <h3 className="font-serif italic text-xl text-stone-800 mb-2">No trend data</h3>
          <p className="font-sans text-stone-500 text-sm">Add transactions to see your spending over time</p>
        </div>
      )}
    </AnimatedCard>
  );
}

export function SpendingBarChart({ data = [] }) {
  const chartData = data.map((d) => ({
    category: d.category.length > 10 ? d.category.slice(0, 10) + "…" : d.category,
    fullCategory: d.category,
    Spent: Math.round(d.total_spent),
    Budget: Math.round(d.budget_limit),
  }));

  return (
    <AnimatedCard index={6} className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-xl font-semibold text-stone-900">Spend vs Budget</h3>
        <div className="flex gap-4">
          {[{ label: "Spent", color: "#1C1B19" }, { label: "Budget", color: "#D6D3D1" }].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ background: color }} />
              <span className="font-sans text-xs text-stone-500 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
      {chartData.length ? (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={4} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(28,27,25,0.08)" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#78716C", fontFamily: "var(--font-sans)" }} axisLine={false} tickLine={false} tickMargin={8} />
              <YAxis tick={{ fontSize: 11, fill: "#78716C", fontFamily: "var(--font-sans)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} tickMargin={8} />
              <Tooltip content={<BarTooltip />} />
              <Bar dataKey="Spent"  fill="#1C1B19" radius={[4, 4, 0, 0]} animationDuration={900} />
              <Bar dataKey="Budget" fill="#D6D3D1" radius={[4, 4, 0, 0]} animationDuration={900} animationBegin={200} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-12 px-6">
          <h3 className="font-serif italic text-xl text-stone-800 mb-2">No comparison data</h3>
          <p className="font-sans text-stone-500 text-sm">Run AI analysis to compare your spending vs budget</p>
        </div>
      )}
    </AnimatedCard>
  );
}
