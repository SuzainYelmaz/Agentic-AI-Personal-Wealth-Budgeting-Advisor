import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { User, MessageSquare, LogOut } from "lucide-react";
import ProfileSetup from "./ProfileSetup";

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const { user, signOut } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || "WA";

  const displayName = user?.user_metadata?.full_name || user?.email || "";

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-40 flex justify-center px-6 transition-all duration-300">
        <motion.nav
          className="nav-glass rounded-full px-3 py-2.5 flex items-center justify-between w-full max-w-7xl"
          initial={{ y: -72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        >
          <div className="flex items-center pl-4 gap-3">
            <div className="w-2 h-2 rounded-full bg-stone-900"></div>
            <span className="font-sans font-semibold text-lg tracking-tight uppercase text-stone-900">Calm Wealth</span>
          </div>

          <div className="flex items-center gap-4 pr-2">
            <button 
              className="w-10 h-10 rounded-full flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors" 
              onClick={() => setShowProfile(true)} 
              title="Profile Settings"
            >
              <User size={18} />
            </button>
            <button 
              className="w-10 h-10 rounded-full flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors" 
              onClick={onToggleSidebar} 
              title="Toggle AI Chat"
            >
              <MessageSquare size={18} />
            </button>
            
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-stone-200/50 rounded-full border border-stone-200">
              <div className="w-7 h-7 rounded-full bg-stone-900 text-stone-50 flex items-center justify-center text-xs font-semibold">
                {initials}
              </div>
              <span className="text-sm font-medium text-stone-800 pr-2">{displayName}</span>
            </div>

            <button 
              className="w-10 h-10 rounded-full flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors" 
              onClick={signOut} 
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </motion.nav>
      </div>

      <ProfileSetup isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </>
  );
}
