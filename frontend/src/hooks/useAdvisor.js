import { useState, useCallback } from "react";
import { api } from "../utils/api";

export function useAdvisor() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const runAnalysis = useCallback(async (year, month) => {
    setLoading(true);
    setAnalysisResult(null);
    try {
      const result = await api.runAdvisor(year, month);
      console.log("Analysis result:", result);
      if (result.plan) {
        setPlan(result.plan);
      }
      setAnalysisResult({
        success: result.success,
        warnings: result.warnings || [],
        messages: result.pipeline_messages || [],
      });
      return result;
    } catch (e) {
      console.error("Advisor failed:", e);
      setAnalysisResult({ success: false, warnings: [e.message], messages: [] });
    } finally { setLoading(false); }
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

  return { plan, loading, runAnalysis, analysisResult, chatMessages, chatLoading, sendChat };
}
