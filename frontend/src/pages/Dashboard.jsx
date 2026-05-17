import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign, TrendingDown, Save, Target, Zap, Plus,
  CheckCircle, AlertTriangle, RefreshCw,
} from "lucide-react";
import Layout from "../components/Layout";
import AnimatedCard from "../components/AnimatedCard";
import { SpendingPieChart, SpendingAreaChart, SpendingBarChart } from "../components/SpendingChart";
import BudgetProgress from "../components/BudgetProgress";
import TransactionList from "../components/TransactionList";
import AdvisoryPlan from "../components/AdvisoryPlan";
import ManageBudgets from "../components/ManageBudgets";
import AddTransactionModal from "../components/AddTransactionModal";
import AgentPipeline from "../components/AgentPipeline";
import SavingsRingChart from "../components/SavingsRingChart";
import { useTransactions } from "../hooks/useTransactions";
import { useAdvisor } from "../hooks/useAdvisor";
import { api } from "../utils/api";
import { formatCurrency, getMonthName } from "../utils/formatters";

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, change, changeType, index }) {
  const isPositive = changeType === "positive";
  return (
    <AnimatedCard index={index}>
      <div className="w-12 h-12 rounded-full border border-stone-300 flex items-center justify-center mb-6 bg-white/50 text-stone-800">
        <Icon size={20} />
      </div>
      <div className="text-xs font-sans font-semibold uppercase tracking-wider text-stone-500 mb-1">{label}</div>
      <div className="text-3xl font-serif text-stone-900">{value}</div>
      {change && (
        <span className={`inline-flex items-center gap-1 font-sans text-xs font-semibold px-2 py-1 rounded-full mt-3 uppercase tracking-wider ${
          isPositive ? "bg-stone-200 text-stone-800" : "bg-red-100 text-red-800"
        }`}>
          {change}
        </span>
      )}
    </AnimatedCard>
  );
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div
      className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 text-sm font-medium ${
        type === "success" ? "bg-stone-900 text-stone-50" : "bg-red-50 text-red-700 border border-red-200"
      }`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
    >
      {type === "success" ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
      <span>{message}</span>
    </motion.div>
  );
}

// ─── Section Divider ─────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="font-sans text-xs font-semibold uppercase tracking-widest text-stone-400">{children}</span>
      <div className="flex-1 h-px bg-stone-200" />
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const now   = new Date();
  const year  = now.getFullYear();
  const month = now.getMonth() + 1;

  const [showAddTx,       setShowAddTx]       = useState(false);
  const [toast,           setToast]           = useState(null);
  const [showPipeline,    setShowPipeline]    = useState(false);
  const [monthlyIncome,   setMonthlyIncome]   = useState(0);
  const advisoryRef = useRef(null);

  const { transactions, loading: txLoading, fetchTransactions, addTransaction, removeTransaction } = useTransactions(year, month);
  const {
    plan, loading: advisorLoading, initialLoading,
    runAnalysis, analysisResult, agentSteps,
    chatMessages, chatLoading, sendChat,
  } = useAdvisor(year, month);

  // ── Fetch profile once on mount for monthly income ────────────────────────
  useEffect(() => {
    api.getProfile()
      .then((p) => { if (p?.monthly_income) setMonthlyIncome(p.monthly_income); })
      .catch(console.error);
  }, []);

  // ── Keep monthlyIncome in sync with plan if AI provides it ───────────────
  useEffect(() => {
    if (plan?.total_income && plan.total_income > 0) {
      setMonthlyIncome(plan.total_income);
    }
  }, [plan]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  // ── Show pipeline & toast on analysis result ──────────────────────────────
  useEffect(() => {
    if (analysisResult) {
      if (analysisResult.success) {
        setToast({ message: "Analysis complete! Advisory plan updated.", type: "success" });
        setTimeout(() => advisoryRef.current?.scrollIntoView({ behavior: "smooth" }), 1800);
        // Hide pipeline after all done + 3s
        setTimeout(() => setShowPipeline(false), 4500);
      } else if (analysisResult.warnings?.length) {
        setToast({ message: analysisResult.warnings[0], type: "error" });
        setShowPipeline(false);
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

  const handleRunAnalysis = useCallback(() => {
    setShowPipeline(true);
    runAnalysis(year, month);
  }, [runAnalysis, year, month]);

  // ── Derived values ────────────────────────────────────────────────────────
  const displayTransactions = transactions || [];
  const displayPlan         = plan || null;
  const displaySpending     = plan?.spending_breakdown || [];
  const totalSpent          = plan?.total_spent || displayTransactions.reduce((s, t) => s + t.amount, 0);
  const totalBudget         = displaySpending.reduce((s, c) => s + c.budget_limit, 0) || 1;
  const savings             = monthlyIncome - totalSpent;
  const budgetHealth        = Math.max(0, Math.round((1 - totalSpent / totalBudget) * 100));

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Layout chatMessages={chatMessages} chatLoading={chatLoading} onSendChat={sendChat} year={year} month={month}>

      {/* ── Page Header ── */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div>
          <span className="text-sm font-sans font-semibold uppercase tracking-widest text-stone-500 block mb-2">Overview</span>
          <h1 className="text-4xl font-serif text-stone-900">{getMonthName(month)} {year}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 font-medium font-sans text-sm hover:bg-stone-200 transition-colors flex items-center gap-2"
            onClick={() => setShowAddTx(true)}
          >
            <Plus size={16} /> Add Transaction
          </button>
          <button
            className="btn-elegant px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-2"
            onClick={handleRunAnalysis}
            disabled={advisorLoading}
          >
            {advisorLoading
              ? <span className="w-4 h-4 border-2 border-stone-500 border-t-stone-50 rounded-full animate-spin" />
              : <Zap size={16} />}
            {advisorLoading ? "Analyzing…" : "Run AI Analysis"}
          </button>
        </div>
      </motion.div>

      {/* ── Agent Pipeline (appears only while running) ── */}
      <AgentPipeline steps={agentSteps} visible={showPipeline} />

      {/* ── Stat Cards ── */}
      <SectionLabel>Financial Overview</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard icon={DollarSign} label="Monthly Income"
          value={monthlyIncome > 0 ? formatCurrency(monthlyIncome) : "—"}
          change={monthlyIncome > 0 ? "↑ Stable" : "Set in Profile"}
          changeType="positive" index={0} />
        <StatCard icon={TrendingDown} label="Total Spent"
          value={formatCurrency(totalSpent)}
          change={`${Math.round(totalSpent / totalBudget * 100)}% of budget`}
          changeType={totalSpent > totalBudget ? "negative" : "positive"} index={1} />
        <StatCard icon={Save} label="Savings"
          value={formatCurrency(savings)}
          change={savings > 0 ? "↑ Great" : "↓ Review spending"}
          changeType={savings > 0 ? "positive" : "negative"} index={2} />
        <StatCard icon={Target} label="Budget Health"
          value={`${budgetHealth}%`}
          change={budgetHealth >= 50 ? "On track" : "At risk"}
          changeType={budgetHealth >= 50 ? "positive" : "negative"} index={3} />
      </div>

      {/* ── Charts Row 1: Pie + Area + Savings Ring ── */}
      <SectionLabel>Spending Analytics</SectionLabel>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <SpendingPieChart data={displaySpending} />
        </div>
        <div className="lg:col-span-1">
          <SpendingAreaChart transactions={displayTransactions} />
        </div>
        <div className="lg:col-span-1">
          <SavingsRingChart totalIncome={monthlyIncome} totalSpent={totalSpent} />
        </div>
      </div>

      {/* ── Charts Row 2: Bar Chart (full width) ── */}
      <div className="mb-12">
        <SpendingBarChart data={displaySpending} />
      </div>

      {/* ── Budget Progress ── */}
      <SectionLabel>Budget Progress</SectionLabel>
      <div className="mb-12">
        <BudgetProgress data={displaySpending} />
      </div>

      {/* ── Manage Budget Goals ── */}
      <SectionLabel>Budget Goals</SectionLabel>
      <div className="mb-12">
        <ManageBudgets />
      </div>

      {/* ── Advisory Plan (persisted, shown after analysis or on refresh) ── */}
      {displayPlan && (
        <>
          <SectionLabel>AI Advisory Plan</SectionLabel>
          <div ref={advisoryRef} className="mb-12">
            <AdvisoryPlan plan={displayPlan} />
          </div>
        </>
      )}

      {/* ── Recent Transactions ── */}
      <SectionLabel>Recent Transactions</SectionLabel>
      <div className="mb-12">
        <TransactionList transactions={displayTransactions} onDelete={handleDeleteTransaction} />
      </div>

      {/* ── Modals ── */}
      <AddTransactionModal isOpen={showAddTx} onClose={() => setShowAddTx(false)} onAdd={handleAddTransaction} />

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </Layout>
  );
}
