import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageSquare, Bot } from "lucide-react";

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
      className="fixed top-0 right-0 h-full w-[400px] bg-stone-50 border-l border-stone-200 shadow-2xl z-50 flex flex-col pt-24 pb-4"
      initial={{ x: 400 }}
      animate={{ x: isOpen ? 0 : 400 }}
      transition={{ type: "spring", stiffness: 300, damping: 35 }}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/80 backdrop-blur-md">
        <h3 className="font-serif text-lg font-semibold text-stone-900 flex items-center gap-2">
          <MessageSquare size={18} /> AI Advisor
          <span className="w-2 h-2 rounded-full bg-stone-900 ml-1 animate-pulse" />
        </h3>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-colors" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-50/30 flex flex-col">
        {!chatMessages.length && (
          <div className="flex flex-col items-center justify-center h-full text-center text-stone-500 p-6">
            <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mb-4 text-stone-700">
              <Bot size={32} />
            </div>
            <p className="font-sans font-medium text-stone-900 mb-1">Ask me anything about your finances!</p>
            <p className="font-sans text-sm font-light">e.g. "How can I save more this month?"</p>
          </div>
        )}
        <AnimatePresence>
          {chatMessages.map((msg, i) => (
            <motion.div
              key={i}
              className={`p-4 rounded-2xl max-w-[85%] font-sans text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-stone-900 text-stone-50 rounded-tr-sm ml-auto' : 'bg-white border border-stone-200 text-stone-800 rounded-tl-sm mr-auto'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {msg.content}
            </motion.div>
          ))}
        </AnimatePresence>
        {chatLoading && (
          <div className="bg-white border border-stone-200 text-stone-800 p-4 rounded-2xl rounded-tl-sm mr-auto max-w-[85%] shadow-sm">
            <div className="flex gap-1 items-center justify-center py-1">
              <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 mx-4 mt-2 bg-white border border-stone-200 rounded-2xl shadow-sm flex items-center gap-2">
        <input
          className="flex-1 px-3 py-2 bg-transparent text-stone-900 font-sans text-sm focus:outline-none placeholder:text-stone-400"
          placeholder="Ask about your finances..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={chatLoading}
        />
        <button className="w-10 h-10 rounded-xl bg-stone-900 text-stone-50 flex items-center justify-center shrink-0 hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSend} disabled={chatLoading || !input.trim()}>
          <Send size={16} />
        </button>
      </div>
    </motion.aside>
  );
}
