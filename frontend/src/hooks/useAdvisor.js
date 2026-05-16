import { useState, useCallback } from "react";
import { api } from "../utils/api";

export function useAdvisor() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const runAnalysis = useCallback(async (year, month) => {
    setLoading(true);
    try { const result = await api.runAdvisor(year, month); setPlan(result.plan); }
    catch (e) { console.error("Advisor failed:", e); }
    finally { setLoading(false); }
  }, []);

  const sendChat = async (message, year, month) => {
    setChatMessages((prev) => [...prev, { role: "user", content: message }]);
    setChatLoading(true);
    try {
      const result = await api.chatWithAdvisor(message, year, month);
      setChatMessages((prev) => [...prev, { role: "assistant", content: result.response }]);
    } catch (e) {
      setChatMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong." }]);
    } finally { setChatLoading(false); }
  };

  return { plan, loading, runAnalysis, chatMessages, chatLoading, sendChat };
}
