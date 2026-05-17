import { useState } from "react";
import Navbar from "./Navbar";
import ChatSidebar from "./ChatSidebar";

export default function Layout({ children, chatMessages, chatLoading, onSendChat, year, month }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-stone-50 text-stone-900 relative overflow-x-hidden font-sans">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none fixed">
        <div className="w-full h-px bg-stone-300 absolute top-1/4 transform -rotate-2 origin-left"></div>
        <div className="w-full h-px bg-stone-200 absolute top-2/3 transform rotate-3 origin-right"></div>
      </div>

      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

      <main className={`flex-1 pt-32 px-6 md:px-12 pb-16 transition-all duration-300 ease-out z-10 ${sidebarOpen ? "mr-[400px]" : ""}`}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <ChatSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        chatMessages={chatMessages}
        chatLoading={chatLoading}
        onSendMessage={onSendChat}
        year={year}
        month={month}
      />
    </div>
  );
}
