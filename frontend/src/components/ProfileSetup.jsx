import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User } from "lucide-react";
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
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div className="bg-stone-50 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-hairline" initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 bg-white">
              <h2 className="font-serif text-xl font-semibold text-stone-900 flex items-center gap-2"><User size={20} />Profile Settings</h2>
              <button className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors" onClick={onClose}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-5 bg-stone-50/50">
                <div className="flex flex-col">
                  <label className="block font-sans font-medium text-xs text-stone-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                  <input className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 font-sans text-sm focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-all placeholder:text-stone-400" type="text" value={form.full_name}
                    onChange={(e) => handleChange("full_name", e.target.value)} placeholder="John Doe" />
                </div>
                <div className="flex flex-col">
                  <label className="block font-sans font-medium text-xs text-stone-600 mb-1.5 uppercase tracking-wide">Monthly Income</label>
                  <input className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 font-sans text-sm focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-all placeholder:text-stone-400 font-mono" type="number" step="0.01" min="0"
                    value={form.monthly_income} onChange={(e) => handleChange("monthly_income", e.target.value)}
                    placeholder="5000.00" />
                </div>
                <div className="flex flex-col">
                  <label className="block font-sans font-medium text-xs text-stone-600 mb-1.5 uppercase tracking-wide">Currency</label>
                  <select className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 font-sans text-sm focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-all" value={form.currency}
                    onChange={(e) => handleChange("currency", e.target.value)}>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="block font-sans font-medium text-xs text-stone-600 mb-1.5 uppercase tracking-wide">Financial Goals</label>
                  <input className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 font-sans text-sm focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-all placeholder:text-stone-400" type="text" value={form.financial_goals}
                    onChange={(e) => handleChange("financial_goals", e.target.value)}
                    placeholder="e.g. Save for a house, build emergency fund" />
                </div>
                <div className="flex flex-col">
                  <label className="block font-sans font-medium text-xs text-stone-600 mb-1.5 uppercase tracking-wide">Risk Tolerance</label>
                  <select className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 font-sans text-sm focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-all" value={form.risk_tolerance}
                    onChange={(e) => handleChange("risk_tolerance", e.target.value)}>
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-stone-200 bg-white">
                <button type="button" className="px-5 py-2.5 rounded-lg border border-stone-300 text-stone-700 font-medium font-sans text-sm hover:bg-stone-100 transition-colors" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-elegant px-5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center min-w-[120px]" disabled={loading}>
                  {loading ? <span className="w-4 h-4 border-2 border-stone-500 border-t-stone-50 rounded-full animate-spin"></span> : saved ? "✓ Saved!" : "Save Profile"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
