# 💰 AI-Driven Personal Wealth & Budgeting Advisor

An intelligent financial advisory platform powered by **LangGraph** multi-agent workflows, **Supabase** for auth & data, and **React** for a premium dashboard experience.

## 🏗️ Architecture

```
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

## 🤖 LangGraph Agents

| Agent | Role |
|---|---|
| **DataFetchAgent** | Fetches transactions, budget goals, and user profile from Supabase |
| **CategorizerAgent** | Categorizes spending via structured LLM tool-calling (OpenRouter) |
| **BudgetAnalystAgent** | Cross-references spending vs budget goals, produces summary |
| **AdvisorAgent** | Generates a tailored, step-by-step financial advisory plan |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Supabase project (free tier works)
- OpenRouter API key

### 1. Database Setup
Run these SQL scripts in your Supabase SQL Editor (in order):
1. `backend/supabase/schema.sql` — Creates tables, indexes, triggers
2. `backend/supabase/rls_policies.sql` — Row-level security policies
3. `backend/supabase/seed.sql` — Synthetic sample data

### 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env          # Fill in your keys
uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env          # Fill in your Supabase URL + key
npm run dev
```

## 📁 Project Structure
```
├── backend/
│   ├── app/
│   │   ├── agents/          # LangGraph nodes (4 named agents)
│   │   ├── tools/           # Supabase & LLM tools
│   │   ├── models/          # Pydantic schemas
│   │   ├── routers/         # FastAPI route handlers
│   │   ├── services/        # Supabase & OpenRouter clients
│   │   ├── config.py        # Environment config
│   │   ├── dependencies.py  # Auth middleware
│   │   └── main.py          # FastAPI entry point
│   └── supabase/            # SQL scripts
├── frontend/
│   └── src/
│       ├── components/      # React UI components
│       ├── pages/           # Login, Register, Dashboard
│       ├── hooks/           # Custom React hooks
│       ├── context/         # Auth context provider
│       ├── config/          # Supabase client
│       └── utils/           # API client & formatters
└── README.md
```

## 🔑 Environment Variables

### Backend (.env)
| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_KEY` | Supabase service role key |
| `OPENROUTER_API_KEY` | OpenRouter API key |
| `OPENROUTER_MODEL` | LLM model (default: `anthropic/claude-sonnet-4`) |

### Frontend (.env)
| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |
| `VITE_API_URL` | Backend API URL (default: `http://localhost:8000/api`) |

## 📜 License
MIT
