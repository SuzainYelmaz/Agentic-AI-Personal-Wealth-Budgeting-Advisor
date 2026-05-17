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
    <div className="min-h-screen flex items-center justify-center bg-stone-50 relative overflow-hidden px-4">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="w-full h-px bg-stone-300 absolute top-1/4 transform -rotate-2 origin-left"></div>
        <div className="w-full h-px bg-stone-200 absolute top-2/3 transform rotate-3 origin-right"></div>
      </div>

      <motion.div
        className="card-stone p-10 sm:p-12 max-w-md w-full relative z-10 shadow-2xl shadow-stone-900/5 border border-hairline"
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-stone-900"></div>
            <span className="font-sans font-semibold text-xl tracking-tight uppercase text-stone-900">Calm Wealth</span>
          </div>
          <h1 className="text-4xl font-serif text-stone-900 text-center">Create Account.</h1>
          <p className="text-stone-500 font-sans font-light mt-2 text-center">Start your financial wellness journey.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg text-sm mb-6 text-center font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-sans font-medium text-sm text-stone-700 mb-2" htmlFor="register-name">Full Name</label>
            <input id="register-name" type="text" placeholder="Jane Doe"
              className="w-full px-4 py-3.5 bg-stone-100 border border-stone-200 rounded-xl text-stone-900 font-sans focus:outline-none focus:border-stone-400 focus:ring-4 focus:ring-stone-200/50 transition-all placeholder:text-stone-400"
              value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div>
            <label className="block font-sans font-medium text-sm text-stone-700 mb-2" htmlFor="register-email">Email Address</label>
            <input id="register-email" type="email" placeholder="you@example.com"
              className="w-full px-4 py-3.5 bg-stone-100 border border-stone-200 rounded-xl text-stone-900 font-sans focus:outline-none focus:border-stone-400 focus:ring-4 focus:ring-stone-200/50 transition-all placeholder:text-stone-400"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block font-sans font-medium text-sm text-stone-700 mb-2" htmlFor="register-password">Password</label>
            <input id="register-password" type="password" placeholder="Min 6 characters"
              className="w-full px-4 py-3.5 bg-stone-100 border border-stone-200 rounded-xl text-stone-900 font-sans focus:outline-none focus:border-stone-400 focus:ring-4 focus:ring-stone-200/50 transition-all placeholder:text-stone-400"
              value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <button type="submit" disabled={loading} className="btn-elegant w-full py-4 rounded-xl text-lg font-medium mt-2 flex items-center justify-center">
            {loading ? <span className="w-5 h-5 border-2 border-stone-500 border-t-stone-50 rounded-full animate-spin"></span> : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-sans text-stone-500">
          Already have an account? <Link to="/login" className="text-stone-900 font-semibold hover:underline">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
}
