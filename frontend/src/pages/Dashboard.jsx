import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiDollarSign, FiTrendingDown, FiSave, FiTarget, FiZap, FiPlus, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import Layout from "../components/Layout";
import AnimatedCard from "../components/AnimatedCard";
import { SpendingPieChart, SpendingAreaChart } from "../components/SpendingChart";
import BudgetProgress from "../components/BudgetProgress";
import TransactionList from "../components/TransactionList";
import AdvisoryPlan from "../components/AdvisoryPlan";
import ManageBudgets from "../components/ManageBudgets";
import AddTransactionModal from "../components/AddTransactionModal";
import { useTransactions } from "../hooks/useTransactions";
import { useAdvisor } from "../hooks/useAdvisor";
import { formatCurrency, getMonthName } from "../utils/formatters";


function StatCard({ icon: Icon, label, value, change, changeType, bgClass, index }) {
  return (
    <AnimatedCard className="stat-card" index={index}>
      <div className={`stat-icon ${bgClass}`}><Icon size={20} /></div>
      <div className="card-label">{label}</div>
      <div className="card-value">{value}</div>
      {change && <span className={`stat-change ${changeType}`}>{change}</span>}
    </AnimatedCard>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div className={`toast ${type}`} initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
      {type === "success" ? <FiCheckCircle size={16} /> : <FiAlertTriangle size={16} />}
      <span style={{ marginLeft: 8 }}>{message}</span>
    </motion.div>
  );
}

export default function Dashboard() {
  const now = new Date();
  const [year] = useState(now.getFullYear());
  const [month] = useState(now.getMonth() + 1);
  const [showAddTx, setShowAddTx] = useState(false);
  const [toast, setToast] = useState(null);
  const advisoryRef = useRef(null);

  const { transactions, loading: txLoading, fetchTransactions, addTransaction, removeTransaction } = useTransactions(year, month);
  const { plan, loading: advisorLoading, runAnalysis, analysisResult, chatMessages, chatLoading, sendChat } = useAdvisor();

  const displayTransactions = transactions || [];
  const displayPlan = plan || null;
  const displaySpending = plan?.spending_breakdown || [];
  const totalSpent = plan?.total_spent || displayTransactions.reduce((s, t) => s + t.amount, 0);
  const totalBudget = displaySpending.reduce((s, c) => s + c.budget_limit, 0) || 1;
  const monthlyIncome = plan?.total_income || 0;
  const savings = monthlyIncome - totalSpent;

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  // Show toast and scroll when analysis completes
  useEffect(() => {
    if (analysisResult) {
      if (analysisResult.success) {
        setToast({ message: "Analysis complete! Scroll down for your advisory plan.", type: "success" });
        setTimeout(() => advisoryRef.current?.scrollIntoView({ behavior: "smooth" }), 500);
      } else if (analysisResult.warnings?.length) {
        setToast({ message: analysisResult.warnings[0], type: "error" });
      }
    }
  }, [analysisResult]);

  const handleAddTransaction = async (data) => {
    await addTransaction(data);
    setToast({ message: "Transaction added successfully!", type: "success" });
  };

  const handleDeleteTransaction = async (id) => {
    await removeTransaction(id);
    setToast({ message: "Transaction deleted.", type: "success" });
  };

  const handleRunAnalysis = () => runAnalysis(year, month);

  return (
    <Layout chatMessages={chatMessages} chatLoading={chatLoading} onSendChat={sendChat} year={year} month={month}>
      {/* Page Header */}
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div>
          <h1 className="section-title">{getMonthName(month)} {year}</h1>
          <p className="text-sm text-muted">Your financial overview at a glance</p>
        </div>
        <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
          <button className="btn btn-secondary" onClick={() => setShowAddTx(true)}>
            <FiPlus size={16} /> Add Transaction
          </button>
          <button className="btn btn-primary" onClick={handleRunAnalysis} disabled={advisorLoading}>
            <FiZap size={16} />
            {advisorLoading ? "Analyzing..." : "Run AI Analysis"}
          </button>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="stat-grid">
        <StatCard icon={FiDollarSign} label="Monthly Income" value={formatCurrency(monthlyIncome)} change="↑ Stable" changeType="positive" bgClass="income" index={0} />
        <StatCard icon={FiTrendingDown} label="Total Spent" value={formatCurrency(totalSpent)} change={`${Math.round(totalSpent/totalBudget*100)}% of budget`} changeType={totalSpent > totalBudget ? "negative" : "positive"} bgClass="spending" index={1} />
        <StatCard icon={FiSave} label="Savings" value={formatCurrency(savings)} change={savings > 0 ? "↑ Great" : "↓ Review spending"} changeType={savings > 0 ? "positive" : "negative"} bgClass="savings" index={2} />
        <StatCard icon={FiTarget} label="Budget Health" value={`${Math.max(0, Math.round((1 - totalSpent/totalBudget) * 100))}%`} change="On track" changeType="positive" bgClass="budget" index={3} />
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <SpendingPieChart data={displaySpending} />
        <SpendingAreaChart transactions={displayTransactions} />
      </div>

      {/* Budget Progress */}
      <BudgetProgress data={displaySpending} />

      {/* Manage Budget Goals */}
      <div style={{ marginTop: "var(--space-6)" }}>
        <ManageBudgets />
      </div>

      {/* Advisory Plan */}
      <div ref={advisoryRef} style={{ marginTop: "var(--space-6)" }}>
        <AdvisoryPlan plan={displayPlan} />
      </div>

      {/* Recent Transactions */}
      <div style={{ marginTop: "var(--space-6)" }}>
        <TransactionList transactions={displayTransactions} onDelete={handleDeleteTransaction} />
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal isOpen={showAddTx} onClose={() => setShowAddTx(false)} onAdd={handleAddTransaction} />

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </Layout>
  );
}
