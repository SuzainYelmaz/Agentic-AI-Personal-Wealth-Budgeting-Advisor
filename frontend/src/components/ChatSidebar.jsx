import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiX, FiMessageSquare } from "react-icons/fi";

export default function ChatSidebar({ isOpen, onClose, chatMessages, chatLoading, onSendMessage, year, month }) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = () => {
    if (!input.trim() || chatLoading) return;
    onSendMessage(input.trim(), year, month);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <motion.aside
      className={`chat-sidebar ${isOpen ? "" : "closed"}`}
      initial={{ x: 380 }}
      animate={{ x: isOpen ? 0 : 380 }}
      transition={{ type: "spring", stiffness: 300, damping: 35 }}
    >
      <div className="chat-header">
        <h3><FiMessageSquare size={18} /> AI Advisor <span className="chat-header-dot" /></h3>
        <button className="btn btn-ghost btn-icon" onClick={onClose}><FiX size={18} /></button>
      </div>

      <div className="chat-messages">
        {!chatMessages.length && (
          <div className="text-center text-sm text-muted" style={{ padding: "40px 0" }}>
            <p style={{ fontSize: "2rem", marginBottom: 12 }}>🤖</p>
            <p>Ask me anything about your finances!</p>
            <p style={{ marginTop: 4 }}>e.g. "How can I save more this month?"</p>
          </div>
        )}
        <AnimatePresence>
          {chatMessages.map((msg, i) => (
            <motion.div
              key={i}
              className={`chat-message ${msg.role}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {msg.content}
            </motion.div>
          ))}
        </AnimatePresence>
        {chatLoading && (
          <div className="chat-message assistant">
            <div className="loading-spinner" style={{ margin: "4px auto" }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          className="chat-input"
          placeholder="Ask about your finances..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={chatLoading}
        />
        <button className="chat-send-btn" onClick={handleSend} disabled={chatLoading || !input.trim()}>
          <FiSend size={16} />
        </button>
      </div>
    </motion.aside>
  );
}
