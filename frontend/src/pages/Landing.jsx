import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Network, PieChart, ShieldCheck, MessageSquare, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="selection:bg-stone-900 selection:text-stone-50 bg-[#F7F6F3] text-[#1C1B19]">
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6">
        <nav className="nav-glass rounded-full px-3 py-2.5 flex items-center justify-between w-full max-w-5xl">
          <div className="flex items-center pl-4 gap-3">
            <div className="w-2 h-2 rounded-full bg-stone-900"></div>
            <span className="font-sans font-semibold text-lg tracking-tight uppercase">Calm Wealth</span>
          </div>

          <div className="hidden md:flex items-center gap-10 px-8 text-sm font-medium text-stone-600">
            <a href="#about" className="hover:text-stone-900 transition-colors">Architecture</a>
            <a href="#features" className="hover:text-stone-900 transition-colors">Features</a>
            <a href="#agents" className="hover:text-stone-900 transition-colors">AI Agents</a>
            <a href="#stack" className="hover:text-stone-900 transition-colors">Tech Stack</a>
          </div>

          <div>
            {user ? (
              <Link to="/dashboard" className="btn-elegant px-6 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-2">
                Dashboard <ArrowUpRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link to="/login" className="btn-elegant px-6 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-2">
                Quick Start <ArrowUpRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </nav>
      </div>

      <header className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 relative">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <h1 className="text-hero font-serif font-normal text-stone-900 mb-8 reveal">
            Calm Wealth <br />
            <span className="italic text-stone-500">Advisor.</span>
          </h1>

          <p className="mt-4 text-xl md:text-2xl text-stone-600 max-w-2xl mx-auto font-sans font-light leading-relaxed reveal delay-100">
            An intelligent, serene, and professional financial advisory platform powered by Multi-Agent AI workflows, real-time analytics, and a premium design system.
          </p>

          <div className="mt-14 reveal delay-200">
            <Link to={user ? "/dashboard" : "/login"} className="btn-elegant px-10 py-5 rounded-full text-lg font-medium inline-flex items-center gap-3">
              {user ? "Go to Dashboard" : "Start Your Dashboard"}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[30vh] overflow-hidden -z-10 opacity-60">
          <div className="w-full h-px bg-stone-200 absolute bottom-1/2 transform -rotate-2 origin-left"></div>
          <div className="w-full h-px bg-stone-300 absolute bottom-1/3 transform rotate-1 origin-right"></div>
          <div className="w-full h-px bg-stone-200 absolute bottom-1/4 transform -rotate-1 origin-left"></div>
        </div>
      </header>

      <section id="about" className="py-32 px-6 border-t border-hairline relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-4 reveal">
            <span className="text-sm font-sans font-semibold uppercase tracking-widest text-stone-500 block mb-4">01 — Architecture Overview</span>
            <h2 className="text-5xl font-serif text-stone-900">Taking the stress out of budgeting.</h2>
          </div>
          <div className="md:col-span-8 reveal delay-100">
            <p className="text-2xl md:text-3xl font-sans font-light text-stone-700 leading-snug">
              Our platform is cleanly separated into a performant React frontend and a robust FastAPI backend. It doesn't just track your spending—it actively categorizes it, analyzes your budget goals, and provides actionable, step-by-step financial advice tailored to your unique data.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-10 border-t border-none">
              <div>
                <div className="text-3xl font-serif text-stone-900 mb-2">React 19</div>
                <div className="text-xs font-sans font-semibold uppercase tracking-wider text-stone-500">Frontend Stack</div>
              </div>
              <div>
                <div className="text-3xl font-serif text-stone-900 mb-2">FastAPI</div>
                <div className="text-xs font-sans font-semibold uppercase tracking-wider text-stone-500">Backend System</div>
              </div>
              <div>
                <div className="text-3xl font-serif text-stone-900 mb-2">LangGraph</div>
                <div className="text-xs font-sans font-semibold uppercase tracking-wider text-stone-500">AI Orchestration</div>
              </div>
              <div>
                <div className="text-3xl font-serif text-stone-900 mb-2">Supabase</div>
                <div className="text-xs font-sans font-semibold uppercase tracking-wider text-stone-500">Secure Database</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 reveal">
            <span className="text-sm font-sans font-semibold uppercase tracking-widest text-stone-500 block mb-4">02 — Platform Features</span>
            <h2 className="text-6xl font-serif text-stone-900">Intelligent capabilities.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-stone p-12 md:p-16 flex flex-col justify-between min-h-[400px] reveal">
              <div className="w-12 h-12 rounded-full border border-stone-300 flex items-center justify-center mb-10">
                <Network className="w-5 h-5 text-stone-800" />
              </div>
              <div>
                <h3 className="text-3xl font-serif text-stone-900 mb-4">Agentic AI Pipeline</h3>
                <p className="text-lg font-sans text-stone-600 font-light leading-relaxed">
                  Powered by LangGraph, our multi-agent architecture (Data Fetcher → Categorizer → Analyst → Advisor) processes your financial data to generate highly personalized financial plans.
                </p>
              </div>
            </div>

            <div className="card-stone bg-stone-900 text-stone-50 p-12 md:p-16 flex flex-col justify-between min-h-[400px] reveal delay-100">
              <div className="w-12 h-12 rounded-full border border-stone-700 flex items-center justify-center mb-10">
                <PieChart className="w-5 h-5 text-stone-800" />
              </div>
              <div>
                <h3 className="text-3xl font-serif text-stone-900 mb-4">Interactive Financial Charts</h3>
                <p className="text-lg font-sans text-stone-600 font-light leading-relaxed">
                  Visual insights using Recharts, including spending pie charts and trend area charts, instantly reflecting your financial health.
                </p>
              </div>
            </div>

            <div className="card-stone p-12 md:p-16 flex flex-col justify-between min-h-[400px] reveal">
              <div className="w-12 h-12 rounded-full border border-stone-300 flex items-center justify-center mb-10">
                <ShieldCheck className="w-5 h-5 text-stone-800" />
              </div>
              <div>
                <h3 className="text-3xl font-serif text-stone-900 mb-4">Secure by Default</h3>
                <p className="text-lg font-sans text-stone-600 font-light leading-relaxed">
                  Built on Supabase with robust Row-Level Security (RLS) policies ensuring your financial data is strictly isolated and secure.
                </p>
              </div>
            </div>

            <div className="card-stone p-12 md:p-16 flex flex-col justify-between min-h-[400px] reveal delay-100">
              <div className="w-12 h-12 rounded-full border border-stone-300 flex items-center justify-center mb-10">
                <MessageSquare className="w-5 h-5 text-stone-800" />
              </div>
              <div>
                <h3 className="text-3xl font-serif text-stone-900 mb-4">Conversational AI Advisor</h3>
                <p className="text-lg font-sans text-stone-600 font-light leading-relaxed">
                  An interactive chat interface that lets you ask specific questions about your spending, supported by state-of-the-art LLMs via OpenRouter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="agents" className="py-32 px-6 border-y border-none bg-stone-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 reveal">
            <span className="text-sm font-sans font-semibold uppercase tracking-widest text-stone-500 block mb-4">03 — AI Orchestration</span>
            <h2 className="text-6xl font-serif text-stone-900">The LangGraph Agents.</h2>
          </div>

          <div className="flex flex-col border-t border-none">
            <div className="group flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-none reveal hover:pl-6 transition-all duration-300 cursor-pointer">
              <div className="md:w-1/3 mb-4 md:mb-0">
                <h4 className="text-2xl font-serif text-stone-900">DataFetchAgent</h4>
              </div>
              <div className="md:w-1/2">
                <p className="text-lg font-sans text-stone-600 font-light">Securely retrieves user transactions, predefined budget goals, and profile data from Supabase.</p>
              </div>
              <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-6 h-6 text-stone-900" />
              </div>
            </div>

            <div className="group flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-none reveal hover:pl-6 transition-all duration-300 cursor-pointer">
              <div className="md:w-1/3 mb-4 md:mb-0">
                <h4 className="text-2xl font-serif text-stone-900">CategorizerAgent</h4>
              </div>
              <div className="md:w-1/2">
                <p className="text-lg font-sans text-stone-600 font-light">Uses structured LLM tool-calling (via OpenRouter) to accurately categorize uncategorized spending.</p>
              </div>
              <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-6 h-6 text-stone-900" />
              </div>
            </div>

            <div className="group flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-none reveal hover:pl-6 transition-all duration-300 cursor-pointer">
              <div className="md:w-1/3 mb-4 md:mb-0">
                <h4 className="text-2xl font-serif text-stone-900">BudgetAnalystAgent</h4>
              </div>
              <div className="md:w-1/2">
                <p className="text-lg font-sans text-stone-600 font-light">Cross-references actual spending against budget goals to produce a comprehensive financial summary.</p>
              </div>
              <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-6 h-6 text-stone-900" />
              </div>
            </div>

            <div className="group flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-none reveal hover:pl-6 transition-all duration-300 cursor-pointer">
              <div className="md:w-1/3 mb-4 md:mb-0">
                <h4 className="text-2xl font-serif text-stone-900">AdvisorAgent</h4>
              </div>
              <div className="md:w-1/2">
                <p className="text-lg font-sans text-stone-600 font-light">Synthesizes all data to generate a tailored, actionable, and step-by-step financial advisory plan.</p>
              </div>
              <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-6 h-6 text-stone-900" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="stack" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 reveal">
            <span className="text-sm font-sans font-semibold uppercase tracking-widest text-stone-500 block mb-4">04 — System Infrastructure</span>
            <h2 className="text-6xl font-serif text-stone-900">Transparent structuring.</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-12">
            <div className="pt-8 border-t border-none reveal">
              <h3 className="text-3xl font-serif text-stone-900 mb-2">Frontend</h3>
              <p className="text-stone-500 font-sans font-light mb-8 h-12">High-performance user interface.</p>
              <ul className="space-y-4 mb-12 font-sans text-stone-700">
                <li className="flex items-start gap-3"><span className="block w-1.5 h-1.5 mt-2 rounded-full bg-stone-900 shrink-0"></span> React 19 & Vite: Ultra-fast build and rendering.</li>
                <li className="flex items-start gap-3"><span className="block w-1.5 h-1.5 mt-2 rounded-full bg-stone-900 shrink-0"></span> Framer Motion: Fluid, physics-based UI animations.</li>
                <li className="flex items-start gap-3"><span className="block w-1.5 h-1.5 mt-2 rounded-full bg-stone-900 shrink-0"></span> Recharts: Beautiful, responsive data visualization.</li>
              </ul>
            </div>

            <div className="pt-8 reveal delay-100 relative">
              <h3 className="text-3xl font-serif text-stone-900 mb-2">Backend & AI</h3>
              <p className="text-stone-500 font-sans font-light mb-8 h-12">Robust logic and agentic workflows.</p>
              <ul className="space-y-4 mb-12 font-sans text-stone-700">
                <li className="flex items-start gap-3"><span className="block w-1.5 h-1.5 mt-2 rounded-full bg-stone-900 shrink-0"></span> Python 3.11+ & FastAPI: High-performance asynchronous API framework.</li>
                <li className="flex items-start gap-3"><span className="block w-1.5 h-1.5 mt-2 rounded-full bg-stone-900 shrink-0"></span> LangGraph & LangChain: For building and orchestrating the multi-agent AI workflows.</li>
                <li className="flex items-start gap-3"><span className="block w-1.5 h-1.5 mt-2 rounded-full bg-stone-900 shrink-0"></span> OpenRouter: Access to top-tier LLMs for AI intelligence.</li>
              </ul>
            </div>

            <div className="pt-8 border-t border-none reveal delay-200">
              <h3 className="text-3xl font-serif text-stone-900 mb-2">Security & Privacy</h3>
              <p className="text-stone-500 font-sans font-light mb-8 h-12">Strict data isolation protocols.</p>
              <ul className="space-y-4 mb-12 font-sans text-stone-700">
                <li className="flex items-start gap-3"><span className="block w-1.5 h-1.5 mt-2 rounded-full bg-stone-900 shrink-0"></span> All financial data is heavily protected using Supabase Row-Level Security (RLS).</li>
                <li className="flex items-start gap-3"><span className="block w-1.5 h-1.5 mt-2 rounded-full bg-stone-900 shrink-0"></span> Ensuring that a user can only ever read, update, or delete data linked strictly to their own authenticated user_id.</li>
                <li className="flex items-start gap-3"><span className="block w-1.5 h-1.5 mt-2 rounded-full bg-stone-900 shrink-0"></span> No cross-user data leakage is possible at the database level.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer id="footer" className="bg-stone-900 text-stone-50 pt-32 pb-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-32">
            <div className="reveal">
              <h2 className="text-5xl md:text-7xl font-serif font-normal mb-8">Initiate <br /><span className="italic text-stone-400">setup.</span></h2>
              <p className="text-xl font-sans font-light text-stone-400 mb-4">View the repository Quick Start Guide.</p>
            </div>

            <div className="grid grid-cols-2 gap-10 reveal delay-100">
              <div>
                <h4 className="font-sans font-semibold text-xs uppercase tracking-widest text-stone-500 mb-8">Navigation</h4>
                <ul className="space-y-4 font-sans font-light text-stone-300">
                  <li><a href="#about" className="hover:text-stone-50 transition-colors">Architecture Overview</a></li>
                  <li><a href="#features" className="hover:text-stone-50 transition-colors">Platform Features</a></li>
                  <li><a href="#agents" className="hover:text-stone-50 transition-colors">The LangGraph Agents</a></li>
                  <li><a href="#stack" className="hover:text-stone-50 transition-colors">Tech Stack</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-sans font-semibold text-xs uppercase tracking-widest text-stone-500 mb-8">Directory Structure</h4>
                <ul className="space-y-4 font-sans font-light text-stone-300">
                  <li><span className="text-stone-500">backend/app/</span></li>
                  <li><span className="text-stone-500">backend/supabase/</span></li>
                  <li><span className="text-stone-500">frontend/src/components/</span></li>
                  <li><span className="text-stone-500">frontend/src/hooks/</span></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end border-t border-stone-800 pt-10 reveal delay-200">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-stone-50"></div>
                <span className="font-sans font-semibold text-xl tracking-tight uppercase">Calm Wealth</span>
              </div>
              <p className="text-stone-500 font-sans font-light max-w-sm">
                This project is licensed under the MIT License.
              </p>
            </div>

            <div className="text-stone-500 font-sans text-sm">
              &copy; 2026 Calm Wealth Advisor.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
