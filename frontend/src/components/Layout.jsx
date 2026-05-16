import { useState } from "react";
import Navbar from "./Navbar";
import ChatSidebar from "./ChatSidebar";

export default function Layout({ children, chatMessages, chatLoading, onSendChat, year, month }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Background Animated Orbs */}
      <div className="dashboard-bg-orb orb-1"></div>
      <div className="dashboard-bg-orb orb-2"></div>

      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

      <main className={`main-content ${sidebarOpen ? "" : "sidebar-closed"}`}>
        {children}
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
