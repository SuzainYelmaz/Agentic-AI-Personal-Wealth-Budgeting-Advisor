import { useState, useCallback, useEffect } from "react";
import { api } from "../utils/api";

const AGENT_NODES = [
  { id: "DataFetchAgent",     label: "Data Fetch",     description: "Loading transactions & profile" },
  { id: "CategorizerAgent",   label: "Categorizer",    description: "Categorizing transactions via AI" },
  { id: "BudgetAnalystAgent", label: "Budget Analyst", description: "Comparing spend vs budget goals" },
  { id: "AdvisorAgent",       label: "Advisor",        description: "Generating personalized plan" },
];

function makeIdleSteps() {
  return AGENT_NODES.map((n) => ({ ...n, status: "idle" }));
}

export function useAdvisor(year, month) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [agentSteps, setAgentSteps] = useState(makeIdleSteps());
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  // ── On mount: load the persisted plan for the current month ─────────────
  useEffect(() => {
    let cancelled = false;
    setInitialLoading(true);
    api.getAdvisoryReport(year, month)
      .then((res) => {
        if (!cancelled && res.found && res.plan) {
          setPlan(res.plan);
        }
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setInitialLoading(false); });
    return () => { cancelled = true; };
  }, [year, month]);

  // ── Animate agent steps based on pipeline_messages from the backend ─────
  const animateSteps = useCallback(async (messages) => {
    // Reset to idle
    setAgentSteps(makeIdleSteps());

    for (let i = 0; i < AGENT_NODES.length; i++) {
      const node = AGENT_NODES[i];
      // Mark current as running
      setAgentSteps((prev) =>
        prev.map((s) => s.id === node.id ? { ...s, status: "running" } : s)
      );
      // Wait for the corresponding message to arrive (simulate streaming)
      await new Promise((r) => setTimeout(r, 800 + i * 400));
      setAgentSteps((prev) =>
        prev.map((s) => s.id === node.id ? { ...s, status: "done" } : s)
      );
    }
  }, []);

  const runAnalysis = useCallback(async (y, m) => {
    setLoading(true);
    setAnalysisResult(null);
    setAgentSteps(makeIdleSteps());

    // Start animation (it runs concurrently with the actual fetch)
    const animPromise = animateSteps([]);

    try {
      const result = await api.runAdvisor(y, m);
      await animPromise; // ensure animation finishes
      if (result.plan) setPlan(result.plan);
      setAnalysisResult({
        success: result.success,
        warnings: result.warnings || [],
        messages: result.pipeline_messages || [],
      });
      return result;
    } catch (e) {
      console.error("Advisor failed:", e);
      setAnalysisResult({ success: false, warnings: [e.message], messages: [] });
    } finally {
      setLoading(false);
    }
  }, [animateSteps]);

  const sendChat = async (message, y, m) => {
    setChatMessages((prev) => [...prev, { role: "user", content: message }]);
    setChatLoading(true);
    try {
      const result = await api.chatWithAdvisor(message, y, m);
      setChatMessages((prev) => [...prev, { role: "assistant", content: result.response }]);
    } catch {
      setChatMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong." }]);
    } finally { setChatLoading(false); }
  };

  return {
    plan, loading, initialLoading, runAnalysis,
    analysisResult, agentSteps,
    chatMessages, chatLoading, sendChat,
  };
}
