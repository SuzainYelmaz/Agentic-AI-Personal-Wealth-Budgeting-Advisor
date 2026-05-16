import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

const CATEGORIES = ["Housing", "Food", "Transport", "Entertainment", "Health", "Shopping", "Utilities", "Other"];

export default function AddTransactionModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState({
    amount: "", description: "", merchant: "", category: "Other",
    transaction_date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAdd({ ...form, amount: parseFloat(form.amount) });
      setForm({ amount: "", description: "", merchant: "", category: "Other",
        transaction_date: new Date().toISOString().split("T")[0] });
      onClose();
    } catch (err) {
      console.error("Failed to add transaction:", err);
    } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div className="modal-panel" initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}>
            <div className="modal-header">
              <h2>Add Transaction</h2>
              <button className="btn btn-ghost btn-icon" onClick={onClose} style={{ color: "var(--text-muted)" }}>
                <FiX size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Amount</label>
                  <input className="form-input font-mono" type="number" step="0.01" min="0.01"
                    placeholder="0.00" value={form.amount} onChange={(e) => handleChange("amount", e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Merchant</label>
                  <input className="form-input" type="text" placeholder="e.g. Starbucks"
                    value={form.merchant} onChange={(e) => handleChange("merchant", e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input className="form-input" type="text" placeholder="e.g. Morning coffee"
                    value={form.description} onChange={(e) => handleChange("description", e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={(e) => handleChange("category", e.target.value)}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" value={form.transaction_date}
                    onChange={(e) => handleChange("transaction_date", e.target.value)} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="loading-spinner" /> : "Add Transaction"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
