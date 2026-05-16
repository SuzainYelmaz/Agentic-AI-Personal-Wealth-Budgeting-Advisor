"""Advisor router — triggers the LangGraph wealth advisor workflow."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from langchain_core.messages import SystemMessage, HumanMessage
from app.dependencies import get_user_id
from app.agents.graph import wealth_advisor_graph

router = APIRouter()

# System prompt for concise, token-optimized chat responses
CHAT_SYSTEM_PROMPT = """You are a concise personal financial advisor named WealthAdvisor.

RULES:
- Keep ALL responses under 150 words. Be direct and actionable.
- For greetings (hi, hello, hey), respond with a single friendly sentence + ask how you can help.
- Use bullet points for multiple items. No lengthy preambles or disclaimers.
- When discussing money, always include specific numbers.
- Never repeat the user's question back to them.
- Do not use markdown headers. Keep formatting minimal."""


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
        plan = result.get("advisory_plan")
        errors = result.get("errors", [])
        return {
            "plan": plan,
            "warnings": errors if errors else [],
            "success": plan is not None,
            "pipeline_messages": result.get("messages", []),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat")
async def chat_with_advisor(body: ChatRequest, user_id: str = Depends(get_user_id)):
    """Chat endpoint that provides context-aware financial advice with token optimization."""
    from app.services.openrouter import get_llm
    from app.tools.supabase_tools import fetch_monthly_transactions, fetch_budget_goals

    txns = fetch_monthly_transactions.invoke({"user_id": user_id, "year": body.year, "month": body.month})
    goals = fetch_budget_goals.invoke({"user_id": user_id})

    # Build context-aware user message
    context = (f"[Context: User has {len(txns)} transactions "
               f"and {len(goals)} budget goals for {body.month}/{body.year}.]")
    user_content = f"{context}\n\nUser: {body.message}"

    messages = [
        SystemMessage(content=CHAT_SYSTEM_PROMPT),
        HumanMessage(content=user_content),
    ]

    # Use 500 max tokens for chat responses
    response = get_llm(temperature=0.4, max_tokens=500).invoke(messages)
    return {"response": response.content}
