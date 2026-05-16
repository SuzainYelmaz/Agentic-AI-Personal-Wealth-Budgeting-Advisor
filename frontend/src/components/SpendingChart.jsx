import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import AnimatedCard from "./AnimatedCard";
import { formatCurrency } from "../utils/formatters";

const CHART_COLORS = ["#00FF87", "#60EFFF", "#B429F9", "#FFB020", "#FF4A5A", "#00B0FF", "#E040FB", "#00E676"];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card" style={{ padding: "10px 14px", fontSize: "0.8rem", background: "var(--bg-glass)", borderColor: "var(--border-medium)" }}>
      <strong style={{ color: "var(--text-primary)" }}>{payload[0].name || payload[0].payload?.category}</strong>
      <div style={{ color: "var(--accent-start)", fontWeight: "bold", marginTop: "4px" }}>{formatCurrency(payload[0].value)}</div>
    </div>
  );
}

export function SpendingPieChart({ data = [] }) {
  const chartData = data.map((d) => ({ name: d.category, value: d.total_spent }));

  return (
    <AnimatedCard className="chart-card" index={4}>
      <div className="card-header">
        <h3 className="card-title">Spending Breakdown</h3>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={115}
            paddingAngle={4} dataKey="value" animationBegin={200} animationDuration={1000}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
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
    <AnimatedCard className="chart-card" index={5}>
      <div className="card-header">
        <h3 className="card-title">Spending Trend</h3>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={cumulativeData}>
          <defs>
            <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60EFFF" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#60EFFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="cumulative" stroke="#60EFFF" strokeWidth={3}
            fill="url(#gradientArea)" animationDuration={1200} />
        </AreaChart>
      </ResponsiveContainer>
    </AnimatedCard>
  );
}
