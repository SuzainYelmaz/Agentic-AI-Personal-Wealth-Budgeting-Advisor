import { motion, AnimatePresence } from "framer-motion";
import AnimatedCard from "./AnimatedCard";
import { FiAlertTriangle } from "react-icons/fi";

function StepItem({ step }) {
  return (
    <motion.div
      className="advisory-step card"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: step.step_number * 0.1, type: "spring", stiffness: 150 }}
    >
      <div className="step-number">{step.step_number}</div>
      <div className="step-content">
        <h4>{step.title}</h4>
        <p>{step.description}</p>
        <div className="step-meta">
          <span className="step-badge impact">{step.impact}</span>
          <span className={`step-badge ${step.difficulty}`}>{step.difficulty}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdvisoryPlan({ plan }) {
  if (!plan) return null;

  return (
    <div className="advisory-plan">
      <AnimatedCard className="advisory-summary card-gradient" index={8}>
        <h3 className="card-title" style={{ color: "var(--text-inverse)", marginBottom: "var(--space-2)", fontFamily: "var(--font-display)", fontSize: "var(--text-xl)" }}>
          📊 Financial Advisory Plan
        </h3>
        <p>{plan.summary}</p>
      </AnimatedCard>

      <div className="advisory-steps">
        <AnimatePresence>
          {plan.action_steps?.map((step) => <StepItem key={step.step_number} step={step} />)}
        </AnimatePresence>
      </div>

      {plan.risk_alerts?.length > 0 && (
        <div className="risk-alerts">
          <h4 style={{ fontWeight: 600, marginBottom: "var(--space-4)", color: "var(--dark-slate-grey)" }}>⚠️ Risk Alerts</h4>
          {plan.risk_alerts.map((alert, i) => (
            <div key={i} className="risk-alert">
              <FiAlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{alert}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
