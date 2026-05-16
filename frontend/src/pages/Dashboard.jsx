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

const DEMO_SPENDING = [
  { category: "Housing", total_spent: 1895, budget_limit: 2000, percentage_used: 94.8, status: "on_track" },
  { category: "Food", total_spent: 562.47, budget_limit: 600, percentage_used: 93.7, status: "on_track" },
  { category: "Transport", total_spent: 277.5, budget_limit: 400, percentage_used: 69.4, status: "under_budget" },
  { category: "Entertainment", total_spent: 154.97, budget_limit: 200, percentage_used: 77.5, status: "under_budget" },
  { category: "Shopping", total_spent: 299.98, budget_limit: 300, percentage_used: 100, status: "over_budget" },
  { category: "Utilities", total_spent: 227.9, budget_limit: 250, percentage_used: 91.2, status: "on_track" },
  { category: "Health", total_spent: 115, budget_limit: 150, percentage_used: 76.7, status: "under_budget" },
  { category: "Other", total_spent: 90, budget_limit: 200, percentage_used: 45, status: "under_budget" },
];

const DEMO_TRANSACTIONS = [
  { id: "1", merchant: "Cityview Apartments", description: "Monthly rent payment", amount: 1850, category: "Housing", transaction_date: "2026-05-01" },
  { id: "2", merchant: "Whole Foods Market", description: "Weekly groceries", amount: 87.34, category: "Food", transaction_date: "2026-05-02" },
  { id: "3", merchant: "Olive Garden", description: "Dinner with friends", amount: 48.5, category: "Food", transaction_date: "2026-05-03" },
  { id: "4", merchant: "Nike Store", description: "New running shoes", amount: 89.99, category: "Shopping", transaction_date: "2026-05-05" },
  { id: "5", merchant: "ConEdison", description: "Electric bill", amount: 85.4, category: "Utilities", transaction_date: "2026-05-05" },
  { id: "6", merchant: "SuperCuts", description: "Haircut", amount: 25, category: "Other", transaction_date: "2026-05-06" },
  { id: "7", merchant: "DoorDash", description: "Lunch delivery", amount: 15.99, category: "Food", transaction_date: "2026-05-07" },
  { id: "8", merchant: "CVS Pharmacy", description: "Pharmacy", amount: 25, category: "Health", transaction_date: "2026-05-08" },
  { id: "9", merchant: "Shell", description: "Gas fill-up", amount: 45, category: "Transport", transaction_date: "2026-05-08" },
  { id: "10", merchant: "Trader Joes", description: "Weekly groceries", amount: 62.18, category: "Food", transaction_date: "2026-05-09" },
  { id: "11", merchant: "Blue Bottle Coffee", description: "Coffee and brunch", amount: 32, category: "Food", transaction_date: "2026-05-10" },
  { id: "12", merchant: "Ticketmaster", description: "Concert tickets", amount: 65, category: "Entertainment", transaction_date: "2026-05-11" },
  { id: "13", merchant: "Uber", description: "Uber rides", amount: 38.5, category: "Transport", transaction_date: "2026-05-12" },
  { id: "14", merchant: "Amazon", description: "Books", amount: 45, category: "Shopping", transaction_date: "2026-05-13" },
  { id: "15", merchant: "Target", description: "Birthday gift", amount: 50, category: "Other", transaction_date: "2026-05-13" },
];

const DEMO_PLAN = {
  summary: "Your spending for May 2026 shows strong financial discipline overall, with total spending at $3,622.82 against a $4,100 budget. However, the Shopping category has hit its limit, and Food spending is approaching the cap. Your savings rate of 51.7% is excellent — keep it up!",
  total_income: 7500,
  total_spent: 3622.82,
  savings_rate: 0.517,
  spending_breakdown: DEMO_SPENDING,
  action_steps: [
    { step_number: 1, title: "Cut Dining Out by 30%", description: "You spent $225 on restaurants and delivery. Aim to cook at home 4+ times per week to save ~$70/month.", impact: "Save $70/month", difficulty: "easy" },
    { step_number: 2, title: "Set Shopping Cooling Period", description: "Implement a 48-hour rule before non-essential purchases over $50. The $130 headphones purchase could have been deferred.", impact: "Save $80-150/month", difficulty: "easy" },
    { step_number: 3, title: "Automate Savings Transfer", description: "Set up an automatic transfer of $1,500 to your high-yield savings account on the 2nd of each month.", impact: "Save $18,000/year", difficulty: "medium" },
    { step_number: 4, title: "Review Subscription Stack", description: "You're paying $27/month for Netflix + Spotify. Consider bundling or exploring family plans to save.", impact: "Save $10-15/month", difficulty: "easy" },
    { step_number: 5, title: "Optimize Transport Costs", description: "With a metro pass at $127 and gas at $87, consider whether you need both. Carpooling or bike commuting could reduce costs.", impact: "Save $40-80/month", difficulty: "medium" },
  ],
  risk_alerts: [
    "Shopping category has reached 100% of budget — any additional purchases will push you over.",
    "Food spending is at 93.7% with a week remaining — be cautious with dining out.",
  ],
  month: "2026-05",
};

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

  /* Use real data when available, else demo data for visual demonstration */
  const displayTransactions = transactions.length ? transactions : DEMO_TRANSACTIONS;
  const displayPlan = plan || DEMO_PLAN;
  const displaySpending = plan?.spending_breakdown || DEMO_SPENDING;
  const totalSpent = displaySpending.reduce((s, c) => s + c.total_spent, 0);
  const totalBudget = displaySpending.reduce((s, c) => s + c.budget_limit, 0);

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
        <StatCard icon={FiDollarSign} label="Monthly Income" value={formatCurrency(7500)} change="↑ Stable" changeType="positive" bgClass="income" index={0} />
        <StatCard icon={FiTrendingDown} label="Total Spent" value={formatCurrency(totalSpent)} change={`${Math.round(totalSpent/totalBudget*100)}% of budget`} changeType={totalSpent > totalBudget ? "negative" : "positive"} bgClass="spending" index={1} />
        <StatCard icon={FiSave} label="Savings" value={formatCurrency(7500 - totalSpent)} change="↑ Great" changeType="positive" bgClass="savings" index={2} gradient />
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
