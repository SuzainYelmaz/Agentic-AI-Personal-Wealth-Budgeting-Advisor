import { useState, useCallback } from "react";
import { api } from "../utils/api";

export function useTransactions(year, month) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try { setTransactions(await api.getTransactions(year, month)); }
    catch (e) { console.error("Failed to fetch transactions:", e); }
    finally { setLoading(false); }
  }, [year, month]);

  const addTransaction = async (data) => {
    const created = await api.createTransaction(data);
    setTransactions((prev) => [created, ...prev]);
    return created;
  };

  const removeTransaction = async (id) => {
    await api.deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return { transactions, loading, fetchTransactions, addTransaction, removeTransaction };
}
