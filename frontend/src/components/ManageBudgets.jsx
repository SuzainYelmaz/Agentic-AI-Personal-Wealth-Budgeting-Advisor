import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiTrash2 } from "react-icons/fi";
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
      <div className="card-header">
        <h3 className="card-title">Budget Goals</h3>
        <button className="btn btn-secondary btn-sm" onClick={() => setShowForm(!showForm)}>
          <FiPlus size={14} /> {showForm ? "Cancel" : "Add Goal"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form className="inline-form" onSubmit={handleAdd}
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Monthly Limit</label>
              <input className="form-input font-mono" type="number" step="0.01" min="1"
                placeholder="500.00" value={form.monthly_limit}
                onChange={(e) => setForm((p) => ({ ...p, monthly_limit: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" value={form.priority}
                onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <button className="btn btn-primary btn-sm" type="submit" disabled={loading}>
              {loading ? <span className="loading-spinner" /> : "Save"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div>
        {goals.map((g) => (
          <div key={g.id} className="budget-goal-row">
            <div className="budget-goal-info">
              <span className="category">{g.category}</span>
              <span className="limit">{formatCurrency(g.monthly_limit)}/mo</span>
              <span className="priority">{g.priority} priority</span>
            </div>
            <button className="btn btn-ghost btn-icon" onClick={() => handleDelete(g.id)}
              style={{ color: "var(--danger)" }} title="Delete goal">
              <FiTrash2 size={16} />
            </button>
          </div>
        ))}
        {!goals.length && !showForm && (
          <div className="empty-state">
            <h3>No budget goals yet</h3>
            <p>Set spending limits by category to track your progress</p>
          </div>
        )}
      </div>
    </AnimatedCard>
  );
}
