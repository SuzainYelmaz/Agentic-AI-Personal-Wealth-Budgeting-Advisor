"""Advisor router — triggers the LangGraph wealth advisor workflow."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.dependencies import get_user_id
from app.agents.graph import wealth_advisor_graph

router = APIRouter()


class AdvisorRequest(BaseModel):
    """Request body for running the advisor workflow."""
    year: int
    month: int


class ChatRequest(BaseModel):
    """Request body for the chat endpoint."""
    message: str
    year: int
    month: int


@router.post("/analyze")
async def run_advisor(body: AdvisorRequest, user_id: str = Depends(get_user_id)):
    """Execute the full 4-node LangGraph advisory pipeline."""
    try:
        result = wealth_advisor_graph.invoke({
            "user_id": user_id, "year": body.year, "month": body.month,
            "transactions": [], "categorized_transactions": [], "budget_goals": [],
            "user_profile": {}, "spending_summary": [], "advisory_plan": None,
            "messages": [], "errors": [],
        })
        if result.get("errors"):
            return {"plan": result.get("advisory_plan"), "warnings": result["errors"]}
        return {"plan": result["advisory_plan"], "messages": result["messages"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat")
async def chat_with_advisor(body: ChatRequest, user_id: str = Depends(get_user_id)):
    """Chat endpoint that provides context-aware financial advice."""
    from app.services.openrouter import get_llm
    from app.tools.supabase_tools import fetch_monthly_transactions, fetch_budget_goals
    txns = fetch_monthly_transactions.invoke({"user_id": user_id, "year": body.year, "month": body.month})
    goals = fetch_budget_goals.invoke({"user_id": user_id})
    prompt = (f"You are a personal financial advisor. User has {len(txns)} transactions "
              f"and {len(goals)} budget goals this month.\n\nUser question: {body.message}\n\n"
              f"Provide helpful, specific financial advice.")
    response = get_llm(temperature=0.4).invoke(prompt)
    return {"response": response.content}
