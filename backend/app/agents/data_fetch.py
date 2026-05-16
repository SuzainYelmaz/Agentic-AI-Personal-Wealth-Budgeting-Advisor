"""Node A — DataFetchAgent: Fetches user's monthly transactions and profile from Supabase."""

from app.agents.state import WealthAdvisorState
from app.tools.supabase_tools import fetch_monthly_transactions, fetch_budget_goals, fetch_user_profile


def data_fetch_node(state: WealthAdvisorState) -> dict:
    """Fetch transactions, budget goals, and user profile from Supabase."""
    try:
        transactions = fetch_monthly_transactions.invoke({
            "user_id": state["user_id"],
            "year": state["year"],
            "month": state["month"],
        })
        goals = fetch_budget_goals.invoke({"user_id": state["user_id"]})
        profile = fetch_user_profile.invoke({"user_id": state["user_id"]})
        return {
            "transactions": transactions,
            "budget_goals": goals,
            "user_profile": profile,
            "messages": [f"DataFetchAgent: Loaded {len(transactions)} transactions"],
        }
    except Exception as e:
        return {"transactions": [], "budget_goals": [], "errors": [str(e)]}
