# 🌿 Calm Wealth Advisor

> **An intelligent, serene, and professional financial advisory platform powered by Multi-Agent AI workflows, real-time analytics, and a premium "Calm Wealth" design system.**

Welcome to the **Calm Wealth Advisor**. This platform was designed to take the stress out of personal budgeting by combining a sophisticated, dark-themed UI with powerful LangGraph agentic AI. It doesn't just track your spending—it actively categorizes it, analyzes your budget goals, and provides actionable, step-by-step financial advice tailored to your unique data.

---

## ✨ Features

- **Premium "Calm Wealth" Design**: A beautiful, modern, dark-themed dashboard featuring glassmorphism, dynamic Framer Motion animations, and responsive layouts that look stunning on any device.
- **Agentic AI Pipeline**: Powered by LangGraph, our multi-agent architecture (Data Fetcher → Categorizer → Analyst → Advisor) processes your financial data to generate highly personalized financial plans.
- **Interactive Financial Charts**: Visual insights using Recharts, including spending pie charts and trend area charts, instantly reflecting your financial health.
- **Secure by Default**: Built on Supabase with robust Row-Level Security (RLS) policies ensuring your financial data is strictly isolated and secure.
- **Conversational AI Advisor**: An interactive chat interface that lets you ask specific questions about your spending, supported by state-of-the-art LLMs via OpenRouter.
- **Real-Time Data Sync**: Instantly add, edit, or remove transactions and budget goals with immediate UI updates.

---

## 🏗️ System Architecture

Our platform is cleanly separated into a performant React frontend and a robust FastAPI backend.

```text
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Auth     │  │ Charts   │  │ Budget   │  │ Chat     │    │
│  │ (Supabase)│  │ (Recharts)│  │ Progress │  │ Sidebar  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API
┌──────────────────────┴──────────────────────────────────────┐
│                  FastAPI Backend                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            LangGraph Workflow Pipeline                │   │
│  │                                                      │   │
│  │  DataFetchAgent → CategorizerAgent → BudgetAnalyst → AdvisorAgent │
│  │       │                │                 │              │ │
│  │       ▼                ▼                 ▼              ▼ │
│  │   [Supabase]      [OpenRouter]      [Compute]     [OpenRouter] │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🤖 The LangGraph Agents

At the heart of the backend is an orchestrated workflow of AI agents:

| Agent | Role & Responsibility |
|---|---|
| **DataFetchAgent** | Securely retrieves user transactions, predefined budget goals, and profile data from Supabase. |
| **CategorizerAgent** | Uses structured LLM tool-calling (via OpenRouter) to accurately categorize uncategorized spending. |
| **BudgetAnalystAgent** | Cross-references actual spending against budget goals to produce a comprehensive financial summary. |
| **AdvisorAgent** | Synthesizes all data to generate a tailored, actionable, and step-by-step financial advisory plan. |

---

## 🛠️ Tech Stack

### Frontend
- **React 19 & Vite**: Ultra-fast build and rendering.
- **Framer Motion**: Fluid, physics-based UI animations.
- **Recharts**: Beautiful, responsive data visualization.
- **Supabase JS**: Real-time database and authentication client.

### Backend
- **Python 3.11+ & FastAPI**: High-performance asynchronous API framework.
- **LangGraph & LangChain**: For building and orchestrating the multi-agent AI workflows.
- **OpenRouter**: Access to top-tier LLMs (Claude, OpenAI, Llama, etc.) for AI intelligence.
- **Supabase (PostgreSQL)**: Primary database with advanced Row-Level Security (RLS).

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js 18+](https://nodejs.org/)
- [Python 3.11+](https://www.python.org/)
- A [Supabase](https://supabase.com/) account (the free tier is perfect)
- An [OpenRouter API key](https://openrouter.ai/) for AI features

### 1. Database Setup (Supabase)
Run the following SQL scripts in your Supabase SQL Editor in order:
1. `backend/supabase/schema.sql` — Sets up tables, indexes, and automated triggers.
2. `backend/supabase/rls_policies.sql` — Enforces strict Row-Level Security.
3. `backend/supabase/seed.sql` — (Optional) Injects synthetic data for testing.

### 2. Backend Setup
Navigate to the backend directory, set up your virtual environment, and start the API:
```bash
cd backend
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure your environment
cp .env.example .env          
# Edit .env and add your Supabase URLs and OpenRouter API Key

# Start the FastAPI server
uvicorn app.main:app --reload
```

### 3. Frontend Setup
Navigate to the frontend directory, install dependencies, and run the development server:
```bash
cd frontend
npm install

# Configure your environment
cp .env.example .env          
# Edit .env and add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# Start the Vite server
npm run dev
```

---

## 📁 Directory Structure Overview

```text
├── backend/
│   ├── app/
│   │   ├── agents/          # LangGraph nodes and AI orchestration
│   │   ├── tools/           # Database and LLM specific tools
│   │   ├── models/          # Pydantic validation schemas
│   │   ├── routers/         # FastAPI REST endpoints
│   │   ├── services/        # Supabase & OpenRouter service clients
│   │   ├── config.py        # Environment configuration
│   │   ├── dependencies.py  # Auth and injection middleware
│   │   └── main.py          # FastAPI application entry point
│   └── supabase/            # Database schema, RLS, and seed scripts
├── frontend/
│   └── src/
│       ├── components/      # Reusable React UI components (Charts, Modals, etc.)
│       ├── pages/           # Main views: Dashboard, Login, Register
│       ├── hooks/           # Custom React hooks (useTransactions, useAdvisor)
│       ├── context/         # React Context for global state (AuthContext)
│       └── utils/           # Helper functions and API formatting
└── README.md
```

---

## 🔒 Security & Privacy

We take user privacy seriously. All financial data is heavily protected using **Supabase Row-Level Security (RLS)**, ensuring that a user can only ever read, update, or delete data linked strictly to their own authenticated `user_id`. No cross-user data leakage is possible at the database level.

---

## 📜 License
This project is licensed under the MIT License.
