import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUser } from "react-icons/fi";
import { api } from "../utils/api";

export default function ProfileSetup({ isOpen, onClose }) {
  const [form, setForm] = useState({
    full_name: "", monthly_income: "", currency: "USD",
    financial_goals: "", risk_tolerance: "moderate",
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.getProfile().then((data) => {
        setForm({
          full_name: data.full_name || "",
          monthly_income: data.monthly_income || "",
          currency: data.currency || "USD",
          financial_goals: data.financial_goals || "",
          risk_tolerance: data.risk_tolerance || "moderate",
        });
      }).catch(console.error);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    try {
      await api.updateProfile({
        ...form,
        monthly_income: parseFloat(form.monthly_income) || 0,
        onboarding_complete: true,
      });
      setSaved(true);
      setTimeout(() => { setSaved(false); onClose(); }, 1200);
    } catch (err) { console.error("Failed to update profile:", err); }
    finally { setLoading(false); }
  };

  const handleChange = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div className="modal-panel" initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}>
            <div className="modal-header">
              <h2><FiUser style={{ marginRight: 8, verticalAlign: "middle" }} />Profile Settings</h2>
              <button className="btn btn-ghost btn-icon" onClick={onClose} style={{ color: "var(--text-muted)" }}>
                <FiX size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" type="text" value={form.full_name}
                    onChange={(e) => handleChange("full_name", e.target.value)} placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label className="form-label">Monthly Income</label>
                  <input className="form-input font-mono" type="number" step="0.01" min="0"
                    value={form.monthly_income} onChange={(e) => handleChange("monthly_income", e.target.value)}
                    placeholder="5000.00" />
                </div>
                <div className="form-group">
                  <label className="form-label">Currency</label>
                  <select className="form-select" value={form.currency}
                    onChange={(e) => handleChange("currency", e.target.value)}>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Financial Goals</label>
                  <input className="form-input" type="text" value={form.financial_goals}
                    onChange={(e) => handleChange("financial_goals", e.target.value)}
                    placeholder="e.g. Save for a house, build emergency fund" />
                </div>
                <div className="form-group">
                  <label className="form-label">Risk Tolerance</label>
                  <select className="form-select" value={form.risk_tolerance}
                    onChange={(e) => handleChange("risk_tolerance", e.target.value)}>
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="loading-spinner" /> : saved ? "✓ Saved!" : "Save Profile"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
