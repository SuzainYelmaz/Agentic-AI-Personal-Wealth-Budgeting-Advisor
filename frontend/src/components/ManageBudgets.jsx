import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { api } from "../utils/api";
import { formatCurrency } from "../utils/formatters";
import AnimatedCard from "./AnimatedCard";

const CATEGORIES = ["Housing", "Food", "Transport", "Entertainment", "Health", "Shopping", "Utilities", "Other"];

export default function ManageBudgets() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "Housing", monthly_limit: "", priority: "medium" });

  const fetchGoals = async () => {
    try {
      const data = await api.getBudgetGoals();
      setGoals(data);
    } catch (e) { console.error("Failed to fetch goals:", e); }
  };

  useEffect(() => { fetchGoals(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createBudgetGoal({ ...form, monthly_limit: parseFloat(form.monthly_limit) });
      setForm({ category: "Housing", monthly_limit: "", priority: "medium" });
      setShowForm(false);
      fetchGoals();
    } catch (e) { console.error("Failed to create goal:", e); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteBudgetGoal(id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (e) { console.error("Failed to delete goal:", e); }
  };

  return (
    <AnimatedCard index={9}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-xl font-semibold text-stone-900">Budget Goals</h3>
        <button className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 font-medium font-sans text-xs hover:bg-stone-200 transition-colors flex items-center gap-1" onClick={() => setShowForm(!showForm)}>
          <Plus size={14} /> {showForm ? "Cancel" : "Add Goal"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form className="bg-stone-100 p-5 rounded-xl border border-stone-200 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end" onSubmit={handleAdd}
            initial={{ height: 0, opacity: 0, overflow: 'hidden' }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="flex flex-col">
              <label className="block font-sans font-medium text-xs text-stone-600 mb-1.5 uppercase tracking-wide">Category</label>
              <select className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 font-sans text-sm focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-all" value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="block font-sans font-medium text-xs text-stone-600 mb-1.5 uppercase tracking-wide">Monthly Limit</label>
              <input className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 font-sans text-sm focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-all placeholder:text-stone-400" type="number" step="0.01" min="1"
                placeholder="500.00" value={form.monthly_limit}
                onChange={(e) => setForm((p) => ({ ...p, monthly_limit: e.target.value }))} required />
            </div>
            <div className="flex flex-col">
              <label className="block font-sans font-medium text-xs text-stone-600 mb-1.5 uppercase tracking-wide">Priority</label>
              <select className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 font-sans text-sm focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-all" value={form.priority}
                onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <button className="btn-elegant w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center" type="submit" disabled={loading}>
              {loading ? <span className="w-4 h-4 border-2 border-stone-500 border-t-stone-50 rounded-full animate-spin"></span> : "Save Goal"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div>
        {goals.map((g) => (
          <div key={g.id} className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0 group">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <span className="font-sans font-semibold text-stone-900">{g.category}</span>
              <span className="font-sans text-sm text-stone-600">{formatCurrency(g.monthly_limit)}/mo</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${g.priority === 'high' ? 'bg-red-50 text-red-700' : g.priority === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-stone-100 text-stone-600'}`}>{g.priority} priority</span>
            </div>
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100" onClick={() => handleDelete(g.id)}
              title="Delete goal">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {!goals.length && !showForm && (
          <div className="text-center py-10 px-6">
            <h3 className="font-serif italic text-xl text-stone-800 mb-2">No budget goals yet</h3>
            <p className="font-sans text-stone-500 text-sm">Set spending limits by category to track your progress</p>
          </div>
        )}
      </div>
    </AnimatedCard>
  );
}
