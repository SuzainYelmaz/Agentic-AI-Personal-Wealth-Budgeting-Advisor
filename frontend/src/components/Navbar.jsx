import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { FiMessageSquare, FiLogOut, FiMenu } from "react-icons/fi";

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const { user, signOut } = useAuth();

  const initials = user?.email?.slice(0, 2).toUpperCase() || "WA";

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 30 }}
    >
      <div className="navbar-brand">
        <div className="navbar-brand-icon">💰</div>
        <span>WealthAdvisor</span>
      </div>

      <div className="navbar-actions">
        <button className="btn btn-ghost btn-icon" onClick={onToggleSidebar} title="Toggle AI Chat">
          <FiMessageSquare size={18} />
        </button>
        <div className="navbar-user">
          <div className="navbar-avatar">{initials}</div>
          <span>{user?.email}</span>
        </div>
        <button className="btn btn-ghost btn-icon" onClick={signOut} title="Sign Out">
          <FiLogOut size={18} />
        </button>
      </div>
    </motion.nav>
  );
}
