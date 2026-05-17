import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div className="bg-stone-50 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-hairline" initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 bg-white">
              <h2 className="font-serif text-xl font-semibold text-stone-900 flex items-center">Add Transaction</h2>
              <button className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors" onClick={onClose}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-5 bg-stone-50/50">
                <div className="flex flex-col">
                  <label className="block font-sans font-medium text-xs text-stone-600 mb-1.5 uppercase tracking-wide">Amount</label>
                  <input className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 font-sans text-sm focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-all placeholder:text-stone-400 font-mono" type="number" step="0.01" min="0.01"
                    placeholder="0.00" value={form.amount} onChange={(e) => handleChange("amount", e.target.value)} required />
                </div>
                <div className="flex flex-col">
                  <label className="block font-sans font-medium text-xs text-stone-600 mb-1.5 uppercase tracking-wide">Merchant</label>
                  <input className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 font-sans text-sm focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-all placeholder:text-stone-400" type="text" placeholder="e.g. Starbucks"
                    value={form.merchant} onChange={(e) => handleChange("merchant", e.target.value)} required />
                </div>
                <div className="flex flex-col">
                  <label className="block font-sans font-medium text-xs text-stone-600 mb-1.5 uppercase tracking-wide">Description</label>
                  <input className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 font-sans text-sm focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-all placeholder:text-stone-400" type="text" placeholder="e.g. Morning coffee"
                    value={form.description} onChange={(e) => handleChange("description", e.target.value)} required />
                </div>
                <div className="flex flex-col">
                  <label className="block font-sans font-medium text-xs text-stone-600 mb-1.5 uppercase tracking-wide">Category</label>
                  <select className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 font-sans text-sm focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-all" value={form.category} onChange={(e) => handleChange("category", e.target.value)}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="block font-sans font-medium text-xs text-stone-600 mb-1.5 uppercase tracking-wide">Date</label>
                  <input className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 font-sans text-sm focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-all" type="date" value={form.transaction_date}
                    onChange={(e) => handleChange("transaction_date", e.target.value)} required />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-stone-200 bg-white">
                <button type="button" className="px-5 py-2.5 rounded-lg border border-stone-300 text-stone-700 font-medium font-sans text-sm hover:bg-stone-100 transition-colors" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-elegant px-5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center min-w-[140px]" disabled={loading}>
                  {loading ? <span className="w-4 h-4 border-2 border-stone-500 border-t-stone-50 rounded-full animate-spin"></span> : "Add Transaction"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
