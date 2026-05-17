import { motion, AnimatePresence } from "framer-motion";
import AnimatedCard from "./AnimatedCard";
import { AlertTriangle, TrendingUp, DollarSign, PiggyBank, Percent } from "lucide-react";
import { formatCurrency } from "../utils/formatters";

function InsightCard({ icon: Icon, label, value, sub, highlight }) {
  return (
    <div className={`flex flex-col gap-1.5 px-5 py-4 rounded-xl border ${
      highlight ? "bg-stone-900 border-stone-900 text-stone-50" : "bg-white/60 border-stone-200 text-stone-900"
    }`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} className={highlight ? "text-stone-300" : "text-stone-500"} />
        <span className={`font-sans text-[10px] uppercase tracking-widest font-semibold ${highlight ? "text-stone-400" : "text-stone-500"}`}>{label}</span>
      </div>
      <span className="font-serif text-2xl font-semibold">{value}</span>
      {sub && <span className={`font-sans text-xs ${highlight ? "text-stone-400" : "text-stone-500"}`}>{sub}</span>}
    </div>
  );
}

function StepItem({ step }) {
  const impactText = (step.impact || "").toLowerCase();
  const isHighImpact = impactText.includes("high") || impactText.includes("$");
  const isHard = (step.difficulty || "").toLowerCase() === "hard";

  return (
    <motion.div
      className="bg-stone-100 border border-stone-200 p-6 rounded-2xl flex gap-5 mb-4 items-start shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: step.step_number * 0.1, type: "spring", stiffness: 150 }}
    >
      <div className="w-10 h-10 rounded-full bg-stone-900 text-stone-50 flex items-center justify-center font-bold text-lg shrink-0 font-serif">
        {step.step_number}
      </div>
      <div className="flex-1">
        <h4 className="font-serif text-xl font-semibold text-stone-900 mb-1.5">{step.title}</h4>
        <p className="font-sans text-stone-600 text-base leading-relaxed mb-4">{step.description}</p>
        <div className="flex flex-wrap gap-2.5">
          <span className={`px-3 py-1 rounded-full font-semibold text-xs uppercase tracking-wider ${isHighImpact ? "bg-stone-900 text-stone-50" : "bg-stone-200 text-stone-800"}`}>
            {step.impact}
          </span>
          <span className={`px-3 py-1 rounded-full font-semibold text-xs uppercase tracking-wider ${isHard ? "bg-red-100 text-red-800" : "bg-stone-200 text-stone-800"}`}>
            {step.difficulty} Effort
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdvisoryPlan({ plan }) {
  if (!plan) return null;

  const savingsPct = plan.savings_rate != null
    ? `${(plan.savings_rate * 100).toFixed(1)}%`
    : plan.total_income > 0
      ? `${(((plan.total_income - plan.total_spent) / plan.total_income) * 100).toFixed(1)}%`
      : "—";

  return (
    <div className="mb-10">
      {/* Header gradient card */}
      <AnimatedCard gradient={true} index={8} className="mb-6 rounded-2xl overflow-hidden shadow-xl">
        <h3 className="font-serif text-3xl mb-3 text-stone-900">Financial Advisory Plan.</h3>
        <p className="font-sans text-stone-400 text-base font-light leading-relaxed max-w-4xl">{plan.summary}</p>
      </AnimatedCard>

      {/* Key Insights Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <InsightCard icon={DollarSign} label="Monthly Income" value={formatCurrency(plan.total_income || 0)} sub="from your profile" highlight />
        <InsightCard icon={TrendingUp}  label="Total Spent"    value={formatCurrency(plan.total_spent || 0)}  sub={`of ${formatCurrency(plan.total_income || 0)} income`} />
        <InsightCard icon={PiggyBank}   label="Net Savings"    value={formatCurrency(Math.max(0, (plan.total_income || 0) - (plan.total_spent || 0)))} sub="this month" />
        <InsightCard icon={Percent}     label="Savings Rate"   value={savingsPct} sub={parseFloat(savingsPct) >= 20 ? "Excellent 🎉" : parseFloat(savingsPct) >= 10 ? "Keep going" : "Needs work"} />
      </div>

      {/* Action Steps */}
      <div className="space-y-4">
        <AnimatePresence>
          {plan.action_steps?.map((step) => <StepItem key={step.step_number} step={step} />)}
        </AnimatePresence>
      </div>

      {/* Risk Alerts */}
      {plan.risk_alerts?.length > 0 && (
        <div className="mt-8">
          <h4 className="font-serif text-2xl font-semibold text-stone-900 mb-5">Risk Alerts</h4>
          {plan.risk_alerts.map((alert, i) => (
            <div key={i} className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-3 text-red-800 text-sm font-sans items-start">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              <span className="leading-relaxed">{alert}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
