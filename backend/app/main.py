"""FastAPI application entry point with CORS, routing, and lifespan."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import auth, advisor, transactions, budgets


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle hooks."""
    print("Wealth Advisor API starting...")
    yield
    print("Wealth Advisor API shutting down...")


app = FastAPI(
    title="AI Wealth & Budgeting Advisor",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(advisor.router, prefix="/api/advisor", tags=["Advisor"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["Transactions"])
app.include_router(budgets.router, prefix="/api/budgets", tags=["Budgets"])


@app.get("/health")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy", "service": "wealth-advisor"}
