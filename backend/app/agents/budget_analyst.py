"""Node C — BudgetAnalystAgent: Cross-references spending with budget goals."""

from collections import defaultdict
from app.agents.state import WealthAdvisorState


def _aggregate_spending(categorized: list[dict], transactions: list[dict]) -> dict[str, float]:
    """Sum spending by category using categorized transaction data."""
    amount_map = {t["id"]: t["amount"] for t in transactions}
    totals = defaultdict(float)
    for cat in categorized:
        totals[cat["category"]] += amount_map.get(cat["transaction_id"], 0)
    return dict(totals)


def _build_summary(spending: dict, goals: list[dict]) -> list[dict]:
    """Create spending summary comparing actuals vs budget limits."""
    goal_map = {g["category"]: g["monthly_limit"] for g in goals}
    summary = []
    for category, spent in spending.items():
        limit = goal_map.get(category, spent * 1.2)
        pct = (spent / limit * 100) if limit > 0 else 100
        status = "under_budget" if pct < 80 else "on_track" if pct < 100 else "over_budget"
        summary.append({"category": category, "total_spent": spent,
                        "budget_limit": limit, "percentage_used": round(pct, 1), "status": status})
    return summary


def budget_analyst_node(state: WealthAdvisorState) -> dict:
    """Analyze spending against budget goals and produce summary."""
    categorized = state.get("categorized_transactions", [])
    transactions = state.get("transactions", [])
    goals = state.get("budget_goals", [])
    spending = _aggregate_spending(categorized, transactions)
    summary = _build_summary(spending, goals)
    over = [s for s in summary if s["status"] == "over_budget"]
    return {
        "spending_summary": summary,
        "messages": [f"BudgetAnalystAgent: {len(over)} categories over budget"],
    }
