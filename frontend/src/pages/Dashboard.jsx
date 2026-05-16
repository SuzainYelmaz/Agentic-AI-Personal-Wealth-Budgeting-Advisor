import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiDollarSign, FiTrendingDown, FiSave, FiTarget, FiZap } from "react-icons/fi";
import Layout from "../components/Layout";
import AnimatedCard from "../components/AnimatedCard";
import { SpendingPieChart, SpendingAreaChart } from "../components/SpendingChart";
import BudgetProgress from "../components/BudgetProgress";
import TransactionList from "../components/TransactionList";
import AdvisoryPlan from "../components/AdvisoryPlan";
import { useTransactions } from "../hooks/useTransactions";
import { useAdvisor } from "../hooks/useAdvisor";
import { formatCurrency, getMonthName } from "../utils/formatters";


function StatCard({ icon: Icon, label, value, change, changeType, bgClass, index, gradient }) {
  return (
    <AnimatedCard className="stat-card" index={index} gradient={gradient}>
      <div className={`stat-icon ${bgClass}`}><Icon size={20} /></div>
      <div className="card-label">{label}</div>
      <div className="card-value">{value}</div>
      {change && <span className={`stat-change ${changeType}`}>{change}</span>}
    </AnimatedCard>
  );
}

export default function Dashboard() {
  const now = new Date();
  const [year] = useState(now.getFullYear());
  const [month] = useState(now.getMonth() + 1);
  const { transactions, loading: txLoading, fetchTransactions } = useTransactions(year, month);
  const { plan, loading: advisorLoading, runAnalysis, chatMessages, chatLoading, sendChat } = useAdvisor();

  const displayTransactions = transactions || [];
  const displayPlan = plan || null;
  const displaySpending = plan?.spending_breakdown || [];
  const totalSpent = plan?.total_spent || 0;
  const totalBudget = displaySpending.reduce((s, c) => s + c.budget_limit, 0) || 1;
  const monthlyIncome = plan?.total_income || 0;
  const savings = monthlyIncome - totalSpent;

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleRunAnalysis = () => runAnalysis(year, month);

  return (
    <Layout chatMessages={chatMessages} chatLoading={chatLoading} onSendChat={sendChat} year={year} month={month}>
      {/* Page Header */}
      <motion.div
        className="flex items-center justify-between mb-md"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div>
          <h1 style={{ fontSize: "var(--font-3xl)", fontWeight: 800 }}>
            {getMonthName(month)} {year}
          </h1>
          <p className="text-sm text-muted">Your financial overview at a glance</p>
        </div>
        <button className="btn btn-primary" onClick={handleRunAnalysis} disabled={advisorLoading}>
          <FiZap size={16} />
          {advisorLoading ? "Analyzing..." : "Run AI Analysis"}
        </button>
      </motion.div>

      {/* Stat Cards */}
      <div className="stat-grid">
        <StatCard icon={FiDollarSign} label="Monthly Income" value={formatCurrency(monthlyIncome)} change="↑ Stable" changeType="positive" bgClass="income" index={0} />
        <StatCard icon={FiTrendingDown} label="Total Spent" value={formatCurrency(totalSpent)} change={`${Math.round(totalSpent/totalBudget*100)}% of budget`} changeType={totalSpent > totalBudget ? "negative" : "positive"} bgClass="spending" index={1} />
        <StatCard icon={FiSave} label="Savings" value={formatCurrency(savings)} change={savings > 0 ? "↑ Great" : ""} changeType="positive" bgClass="savings" index={2} gradient />
        <StatCard icon={FiTarget} label="Budget Health" value={`${Math.round((1 - totalSpent/totalBudget) * 100)}%`} change="On track" changeType="positive" bgClass="budget" index={3} />
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <SpendingPieChart data={displaySpending} />
        <SpendingAreaChart transactions={displayTransactions} />
      </div>

      {/* Budget Progress */}
      <BudgetProgress data={displaySpending} />

      {/* Advisory Plan */}
      <div style={{ marginTop: 28 }}>
        <AdvisoryPlan plan={displayPlan} />
      </div>

      {/* Recent Transactions */}
      <div style={{ marginTop: 28 }}>
        <TransactionList transactions={displayTransactions} />
      </div>
    </Layout>
  );
}
