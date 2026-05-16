import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { FiMessageSquare, FiLogOut, FiUser } from "react-icons/fi";
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
      <motion.nav
        className="navbar"
        initial={{ y: -72 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      >
        <div className="navbar-brand">
          <div className="navbar-brand-icon">💰</div>
          <span>WealthAdvisor</span>
        </div>

        <div className="navbar-actions">
          <button className="btn btn-ghost btn-icon" onClick={() => setShowProfile(true)} title="Profile Settings">
            <FiUser size={18} />
          </button>
          <button className="btn btn-ghost btn-icon" onClick={onToggleSidebar} title="Toggle AI Chat">
            <FiMessageSquare size={18} />
          </button>
          <div className="navbar-user">
            <div className="navbar-avatar">{initials}</div>
            <span>{displayName}</span>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={signOut} title="Sign Out">
            <FiLogOut size={18} />
          </button>
        </div>
      </motion.nav>

      <ProfileSetup isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </>
  );
}
