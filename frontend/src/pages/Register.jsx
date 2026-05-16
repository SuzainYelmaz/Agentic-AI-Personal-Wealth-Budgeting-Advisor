import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (authError) throw authError;
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-orb orb-1" />
      <div className="auth-bg-orb orb-2" />

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <div className="auth-logo">💰</div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Start your financial wellness journey</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">Full Name</label>
            <input id="register-name" className="form-input" type="text" placeholder="John Doe"
              value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Email</label>
            <input id="register-email" className="form-input" type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Password</label>
            <input id="register-password" className="form-input" type="password" placeholder="Min 6 characters"
              value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <button className="btn btn-primary auth-btn" type="submit" disabled={loading}>
            {loading ? <span className="loading-spinner" /> : "Create Account"}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
}
