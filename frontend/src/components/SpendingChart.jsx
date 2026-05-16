import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import AnimatedCard from "./AnimatedCard";
import { formatCurrency } from "../utils/formatters";

const CHART_COLORS = ["#55828b", "#87bba2", "#c9e4ca", "#3b6064", "#364958", "#e07a5f", "#f2cc8f", "#2d6a4f"];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      padding: "10px 14px", fontSize: "0.8rem",
      background: "var(--charcoal-blue)", color: "var(--text-inverse)",
      borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow-md)",
    }}>
      <strong style={{ fontFamily: "var(--font-body)" }}>{payload[0].name || payload[0].payload?.category}</strong>
      <div style={{ fontFamily: "var(--font-mono)", fontWeight: 500, marginTop: "4px" }}>
        {formatCurrency(payload[0].value)}
      </div>
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
      {chartData.length ? (
        <ResponsiveContainer width="100%" height={280}>
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
      ) : (
        <div className="empty-state">
          <h3>No spending data</h3>
          <p>Add transactions and run analysis to see your breakdown</p>
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
    <AnimatedCard className="chart-card" index={5}>
      <div className="card-header">
        <h3 className="card-title">Spending Trend</h3>
      </div>
      {cumulativeData.length ? (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={cumulativeData}>
            <defs>
              <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#55828b" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#55828b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(135,187,162,0.2)" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#87bba2", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#87bba2", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="cumulative" stroke="#55828b" strokeWidth={2.5}
              fill="url(#gradientArea)" animationDuration={1200} />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="empty-state">
          <h3>No trend data</h3>
          <p>Add transactions to see your spending over time</p>
        </div>
      )}
    </AnimatedCard>
  );
}
