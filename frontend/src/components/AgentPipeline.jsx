import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader, Circle, Database, Tag, BarChart2, Brain } from "lucide-react";

const NODE_ICONS = {
  DataFetchAgent:     Database,
  CategorizerAgent:   Tag,
  BudgetAnalystAgent: BarChart2,
  AdvisorAgent:       Brain,
};

function StepNode({ step, index }) {
  const Icon = NODE_ICONS[step.id] || Circle;
  const isRunning = step.status === "running";
  const isDone    = step.status === "done";
  const isIdle    = step.status === "idle";

  return (
    <motion.div
      className="flex flex-col items-center gap-2 flex-1 min-w-0"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      {/* Node circle */}
      <motion.div
        className={`relative w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
          isDone    ? "bg-emerald-50 border-emerald-400 text-emerald-600" :
          isRunning ? "bg-amber-50 border-amber-400 text-amber-600" :
                      "bg-stone-100 border-stone-200 text-stone-400"
        }`}
        animate={isRunning ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={isRunning ? { repeat: Infinity, duration: 1.2 } : {}}
      >
        {/* Pulsing ring while running */}
        {isRunning && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-amber-400"
            animate={{ scale: [1, 1.4, 1.4], opacity: [0.8, 0, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
        )}
        {isDone    ? <Check size={20} strokeWidth={2.5} /> :
         isRunning ? <Loader size={18} className="animate-spin" /> :
                     <Icon size={18} />}
      </motion.div>

      {/* Label */}
      <span className={`font-sans text-xs font-semibold uppercase tracking-wider text-center leading-tight ${
        isDone ? "text-emerald-600" : isRunning ? "text-amber-600" : "text-stone-400"
      }`}>
        {step.label}
      </span>

      {/* Status description */}
      <AnimatePresence>
        {(isRunning || isDone) && (
          <motion.span
            className="font-sans text-[10px] text-center text-stone-500 max-w-[90px] leading-tight"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            {isDone ? "✓ Complete" : step.description}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Connector({ done }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-center w-8 mt-[-12px]">
      <motion.div
        className="h-0.5 w-full rounded-full"
        style={{ background: done ? "#34d399" : "#d6d3d1" }}
        animate={{ scaleX: done ? 1 : 0.3, originX: 0 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}

export default function AgentPipeline({ steps, visible }) {
  const allDone = steps.every((s) => s.status === "done");
  const anyActive = steps.some((s) => s.status !== "idle");

  return (
    <AnimatePresence>
      {(visible || anyActive) && (
        <motion.div
          className="mb-8 rounded-2xl border border-stone-200 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden"
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <motion.div
                className="w-2 h-2 rounded-full bg-amber-400"
                animate={!allDone ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] } : { scale: 1 }}
                transition={!allDone ? { repeat: Infinity, duration: 1.5 } : {}}
              />
              <span className="font-sans text-sm font-semibold text-stone-700 uppercase tracking-wider">
                {allDone ? "Analysis Complete" : "AI Agent Pipeline Running…"}
              </span>
            </div>
            {allDone && (
              <motion.span
                className="font-sans text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              >
                ✓ All 4 agents finished
              </motion.span>
            )}
          </div>

          {/* Pipeline nodes */}
          <div className="px-6 py-6 flex items-start justify-between">
            {steps.map((step, i) => (
              <div key={step.id} className="contents">
                <StepNode step={step} index={i} />
                {i < steps.length - 1 && <Connector done={steps[i].status === "done"} />}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
